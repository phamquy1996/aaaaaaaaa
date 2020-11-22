import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@freelancer/location';
import { Interface } from '@freelancer/types';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import * as Rx from 'rxjs';
import {
  ABTest,
  EnrolmentProportion,
  Experiments,
  OverridesMap,
} from '../abtest.service';
import {
  ProjectExperiments,
  SessionExperiments,
  UserExperiments,
} from '../experiments';
import {
  projectExperiments,
  sessionExperiments,
  shouldEnrol,
  userExperiments,
} from './initial-data';

@Injectable({
  providedIn: 'root',
})
export class ABTestTesting implements Interface<ABTest> {
  overridesMap: OverridesMap;
  private _isWhitelistUser = false;

  constructor(
    private location: Location,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: Request,
    @Optional() @Inject(RESPONSE) private response: Response,
  ) {}

  getSessionExperimentVariation<T extends keyof SessionExperiments>(
    experimentName: T,
  ): Rx.Observable<SessionExperiments[T] | undefined> {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getVariation() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }

    // test overrides functionality
    const override = this.getOverride(experimentName);
    if (override) {
      return Rx.of(override);
    }

    if (sessionExperiments[experimentName]) {
      console.log(
        `getSessionExperimentVariation('${experimentName}') is '${sessionExperiments[experimentName]}'.`,
      );
      return Rx.of(sessionExperiments[experimentName] as SessionExperiments[T]);
    }

    throw new Error(
      `${experimentName} is not defined in sessionExperiments. Add the default variation to webapp/src/@freelancer/abtest/testing/initial-data.ts.`,
    );
  }

  // userId is optional, as it'll default to the user's own id
  getUserExperimentVariation<T extends keyof UserExperiments>(
    experimentName: T,
    userId?: number,
  ): Rx.Observable<UserExperiments[T] | undefined> {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getVariation() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }

    // test overrides functionality
    const override = this.getOverride(experimentName);
    if (override) {
      return Rx.of(override);
    }
    if (userExperiments[experimentName]) {
      console.log(
        `getUserExperimentVariation('${experimentName}') is '${userExperiments[experimentName]}'.`,
      );
      return Rx.of(userExperiments[experimentName] as UserExperiments[T]);
    }

    throw new Error(
      `${experimentName} is not defined in userExperiments. Add the default variation to webapp/src/@freelancer/abtest/testing/initial-data.ts.`,
    );
  }

  getProjectExperimentVariation<T extends keyof ProjectExperiments>(
    experimentName: T,
    projectId: number,
  ): Rx.Observable<ProjectExperiments[T] | undefined> {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'getVariation() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }

    // test overrides functionality
    const override = this.getOverride(experimentName);
    if (override) {
      return Rx.of(override);
    }

    if (projectExperiments[experimentName]) {
      console.log(
        `getProjectExperimentVariation('${experimentName}') is '${projectExperiments[experimentName]}'.`,
      );
      return Rx.of(projectExperiments[experimentName] as ProjectExperiments[T]);
    }

    throw new Error(
      `${experimentName} is not defined in projectExperiments. Add the default variation to webapp/src/@freelancer/abtest/testing/initial-data.ts.`,
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
    return shouldEnrol;
  }

  isWhitelistUser(): boolean {
    if (isPlatformServer(this.platformId)) {
      throw new Error(
        'isWhitelistUser() cannot be ran on the server, you must explicitly call ABTest::handleServer() first',
      );
    }
    return this._isWhitelistUser;
  }

  // Specific to ABTestTesting
  setIsWhitelistUser(isWhitelistUser: boolean) {
    this._isWhitelistUser = isWhitelistUser;
  }

  resetState() {
    this._isWhitelistUser = false;
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
