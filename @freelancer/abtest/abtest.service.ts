import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { Location } from '@freelancer/location';
import { Tracking } from '@freelancer/tracking';
import { CookieService } from '@laurentgoudet/ngx-cookie';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import * as md5 from 'blueimp-md5';
import { Request, Response } from 'express';
import * as Rx from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ABTEST_WHITELIST_COOKIE } from './abtest.config';
import {
  ProjectExperiments,
  SessionExperiments,
  UserExperiments,
} from './experiments';

export enum ABTestType {
  SESSION_BASED = 1,
  USER_BASED = 2,
  PROJECT_BASED = 3,
}

export interface ABTestApiResponse<T extends keyof Experiments> {
  state: 'in_test';
  test_id: number;
  variation_name: Experiments[T];
}

/**
 * A valid proportion for ABTest::shouldEnrol
 * This is a special type so we can enforce 0 <= p <= 1
 */
export type EnrolmentProportion =
  | 0
  | 0.01
  | 0.02
  | 0.05
  | 0.1
  | 0.2
  | 0.3
  | 0.4
  | 0.5
  | 0.6
  | 0.7
  | 0.8
  | 0.9
  | 1.0;

export type VariationName = string;

export const STORAGE_KEY = 'WEBAPP_ABTEST_CACHE_V1';

export type Experiments = SessionExperiments &
  UserExperiments &
  ProjectExperiments;

export type OverridesMap = {
  [K in keyof Experiments]?: Experiments[K];
};

// FIXME(T66231): we should make the A/B test service return a tuple of
// `response | error` instead of throwing exceptions, as handling of these
// later can't be enforced in TypeScript.
//
// For now, make sure you catch any ABTest service failure or bad things will
// happen when the backend is down.
@Injectable({
  providedIn: 'root',
})
export class ABTest {
  overridesMap: OverridesMap;

  constructor(
    private auth: Auth,
    private cookies: CookieService,
    private freelancerHttp: FreelancerHttp,
    private tracking: Tracking,
    private location: Location,
    private router: Router,
    @Inject(ABTEST_WHITELIST_COOKIE) private whitelistCookie: string,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  getSessionExperimentVariation<T extends keyof SessionExperiments>(
    experimentName: T,
  ): Rx.Observable<SessionExperiments[T] | undefined> {
    return this.tracking.getSessionId().pipe(
      take(1),
      switchMap(sessionId =>
        this.getVariation(ABTestType.SESSION_BASED, experimentName, sessionId),
      ),
    );
  }

  // userId is optional, as it'll default to the user's own id
  getUserExperimentVariation<T extends keyof UserExperiments>(
    experimentName: T,
    userId?: number,
  ): Rx.Observable<UserExperiments[T] | undefined> {
    const userId$ = userId
      ? Rx.of(userId)
      : this.auth.getUserId().pipe(map(uid => parseInt(uid, 10)));
    return userId$.pipe(
      take(1),
      switchMap(uid =>
        this.getVariation(ABTestType.USER_BASED, experimentName, uid),
      ),
    );
  }

  getProjectExperimentVariation<T extends keyof ProjectExperiments>(
    experimentName: T,
    projectId: number,
  ): Rx.Observable<ProjectExperiments[T] | undefined> {
    return this.getVariation(
      ABTestType.PROJECT_BASED,
      experimentName,
      projectId,
    );
  }

  /**
   * Determines whether or not to enrol a user/project based on a percentage split.
   * Use this function instead of MOD if you want to gradually increase enrolment on an experiment.
   * Enrol/activate the test separately using the appropriate `get*Variation`. function
   *
   * Functionally similar to ABTest::md5sumTestHelper in ABTest.php
   *
   * @param experimentName name of the experiment
   * @param contextId id of user (for user-based tests) or project (for project-based tests) being split on
   * @param testProportion proportion to allow enrolment (eg. 0.2)
   * @returns `true` if the test should be enrolled, false if not
   */
  shouldEnrol<T extends keyof Experiments>(
    experimentName: T,
    contextId: number | string,
    testProportion: EnrolmentProportion,
  ): boolean {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getVariation() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }
    // always enroll when an override is defined as otheriwise it would break
    // the test overrides logic
    const override = this.getOverride(experimentName);
    if (override) {
      return true;
    }
    const hash = md5(`${contextId}${experimentName}`)
      .toString()
      .substr(0, 8);
    const quotient = parseInt(hash, 16) / 0xffffffff;
    return quotient < testProportion;
  }

  isWhitelistUser(): boolean {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'isWhitelistUser() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }
    return this.cookies.get(this.whitelistCookie) === 'true';
  }

  /**
   * Handles A/B tests on the server-side, as none of the other A/B test method
   * will work on the server: this must be called on the server-side only,
   * before any method ABTest method call, by guarding it with
   * `isPlatformServer` check, i.e.:
   *
   *
   * if (isPlatformServer(this.platformId)) {
   *   return this.abTest.handleServer.then(() =>
   *     this.redirectToPhp.doRedirect(fallbackUrl),
   *   );
   * }
   *
   * The `then` callback is called when the default variant should be shown
   * (e.g. UA is a Bot). Otherwise, it will render a blank overlay & will defer
   * the A/B test code evaluation to the client-side.
   */
  handleServer(): Promise<void> {
    this.response.append('Vary', 'X-User-Agent-Bot');
    if (this.request.get('X-User-Agent-Bot') === 'true') {
      return Promise.resolve(undefined);
    }
    return this.router
      .navigate(['/internal/blank'], {
        skipLocationChange: true,
      })
      .then(
        () =>
          new Promise((resolve, reject) => {
            // wait forever
          }),
      );
  }

  private getVariation<T extends keyof Experiments>(
    experimentType: ABTestType,
    experimentName: T,
    identifier: string | number,
  ): Rx.Observable<Experiments[T] | undefined> {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getVariation() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }

    // global test disabling flag, used by automation tools
    if (this.cookies.get('no_abtest') !== undefined) {
      return Rx.of(undefined);
    }
    // test overrides functionality
    const override = this.getOverride(experimentName);
    if (override) {
      return Rx.of(override);
    }
    // try reading the variation from cache if it exists
    const cacheKey = `${STORAGE_KEY}|${experimentType}|${experimentName}|${identifier}`;
    let variationFromStorage: Experiments[T] | undefined;
    try {
      variationFromStorage =
        (window.sessionStorage.getItem(cacheKey) as Experiments[T]) || '';
    } catch (e) {
      // ignore the errors, e.g. quota is full or security error
      console.error(e);
    }
    if (variationFromStorage) {
      return Rx.of(variationFromStorage);
    }
    // overwise get the variation for the A/B test server
    return this.freelancerHttp
      .post<ABTestApiResponse<T>>('abtest/0.1/enrollments/', {
        id_type: experimentType,
        experiment_name: experimentName,
        id: identifier,
      })
      .pipe(
        map(response => {
          if (response.status !== 'success') {
            return undefined;
          }
          return response.result.variation_name;
        }),
        tap(variationName => {
          if (variationName !== undefined) {
            try {
              window.sessionStorage.setItem(cacheKey, variationName);
            } catch (e) {
              // ignore the errors, e.g. quota is full or security error
              console.error(e);
            }
          }
        }),
        catchError(() => Rx.of(undefined)),
      );
  }

  /*
   * This allows to override A/B tests using the
   * ?overrides=<test_name>:<test_variant> query param.
   * Overrides can be chained to override multiple tests, e.g.
   * ?overrides=<test1_name>:<test1_variant>,<test1_name>:<test1_variant>.
   */
  private getOverride<T extends keyof Experiments>(
    experimentName: T,
  ): Experiments[T] | undefined {
    const params = new URL(this.location.href).searchParams.get('overrides');

    if (params) {
      const overridesMap: OverridesMap = this.parseOverridesParam(params);
      if (overridesMap[experimentName]) {
        return overridesMap[experimentName] as Experiments[T];
      }
    }

    // fallback to the persisted overrides map if no query param override is found
    if (this.overridesMap) {
      return this.overridesMap[experimentName] as Experiments[T];
    }

    return undefined;
  }

  setOverridesMap(overridesMap: OverridesMap) {
    this.overridesMap = overridesMap;
  }

  parseOverridesParam<T extends keyof Experiments>(
    overrides: string,
  ): OverridesMap {
    return overrides.split(',').reduce<OverridesMap>((acc, experiment) => {
      const [name, variation] = experiment.split(':');
      acc[name as T] = variation as Experiments[T];
      return acc;
    }, {});
  }
}
