import { Inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Auth } from '@freelancer/auth';
import { arrayIsShallowEqual, Datastore } from '@freelancer/datastore';
import { Enterprise, UsersCollection } from '@freelancer/datastore/collections';
import { UI_CONFIG } from '@freelancer/ui/ui.config';
import { UiConfig } from '@freelancer/ui/ui.interface';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';
import {
  BLACKLISTED_IOS_FEATURES,
  Feature,
  FeatureFlagConfig,
  featureFlagConfigurations,
  SiteTheme,
} from './feature-flags.model';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagsService {
  private flagConfig$: Rx.Observable<FeatureFlagConfig>;

  constructor(
    private datastore: Datastore,
    private auth: Auth,
    @Inject(UI_CONFIG) private uiConfig: UiConfig,
  ) {
    const { theme } = this.uiConfig;
    if (theme !== undefined && theme in featureFlagConfigurations) {
      this.flagConfig$ = Rx.of(featureFlagConfigurations[theme]);
      return;
    }

    const currentUserDoc = this.datastore.document<UsersCollection>(
      'users',
      this.auth.getUserId(),
    );
    // combine the status and value observables into an `Rx.Observable<User | undefined>`
    const loadedUser$ = currentUserDoc.status$.pipe(
      switchMap(status =>
        status.error ? Rx.of(undefined) : currentUserDoc.valueChanges(),
      ),
      distinctUntilChanged(
        (a, b) =>
          !!a && !!b && arrayIsShallowEqual(a.enterpriseIds, b.enterpriseIds),
      ),
    );

    this.flagConfig$ = this.auth.isLoggedIn().pipe(
      switchMap(loggedIn =>
        loggedIn
          ? loadedUser$.pipe(
              map(user => {
                // Datastore errored, fallback to default theme
                if (!user) {
                  return featureFlagConfigurations[SiteTheme.DEFAULT];
                }

                if (user.isDeloitteDcUser) {
                  return featureFlagConfigurations[SiteTheme.DELOITTE];
                }

                if (user.enterpriseIds?.includes(Enterprise.PMI)) {
                  return featureFlagConfigurations[SiteTheme.PMI];
                }
                return featureFlagConfigurations[SiteTheme.DEFAULT];
              }),
            )
          : Rx.of(featureFlagConfigurations[SiteTheme.DEFAULT]),
      ),
    );
  }

  getFlag(feature: Feature): Rx.Observable<boolean> {
    return Capacitor.isNative &&
      Capacitor.getPlatform() === 'ios' &&
      BLACKLISTED_IOS_FEATURES.includes(feature)
      ? Rx.of(false)
      : this.flagConfig$.pipe(
          map(config => config[feature]),
          publishReplay(1),
          refCount(),
        );
  }
}
