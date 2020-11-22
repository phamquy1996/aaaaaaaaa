import { Component, OnInit } from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { Datastore } from '@freelancer/datastore';
import {
  ReferralInvitationCheckCollection,
  UsersSelfCollection,
} from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import { Localization } from '@freelancer/localization';
import { ButtonColor } from '@freelancer/ui/button';
import * as Rx from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-secondary-projects',
  template: `
    <app-bar flTrackingSection="SubnavProjects">
      <app-bar-item
        link="/manage"
        i18n="Secondary navigation projects bar item"
        flTrackingLabel="MyProjects"
      >
        My Projects
      </app-bar-item>
      <app-bar-item
        link="/dashboard"
        i18n="Secondary navigation projects bar item"
        flTrackingLabel="Dashboard"
        [exactLink]="true"
      >
        Dashboard
      </app-bar-item>
      <app-bar-item
        link="/messages"
        i18n="Secondary navigation projects bar item"
        flTrackingLabel="Inbox"
      >
        Inbox
      </app-bar-item>
      <app-bar-item
        *flFeature="Feature.DASHBOARD_FEEDBACK_PAGE"
        link="/dashboard/feedback.php"
        i18n="Secondary navigation projects bar item"
        flTrackingLabel="Feedback"
        [exactLink]="true"
      >
        Feedback
      </app-bar-item>
      <!-- Avoid showing the "Free Credit" button when the primary navbar give button is shown. -->
      <app-bar-item
        *flFeature="Feature.GIVE_GET"
        link="/give"
        i18n="Secondary navigation projects bar item"
        flTrackingLabel="FreeCredit"
        [exactLink]="true"
        [flHideDesktop]="showGiveButton$ | async"
        [flHideTablet]="showGiveButton$ | async"
      >
        Free Credit
      </app-bar-item>
    </app-bar>
  `,
})
export class NavigationSecondaryProjectsComponent implements OnInit {
  Feature = Feature;
  ButtonColor = ButtonColor;

  isGiveGetEligible$: Rx.Observable<boolean>;
  userCountry$: Rx.Observable<string>;
  // Whether to show the give button in the primary navbar.
  showGiveButton$: Rx.Observable<boolean>;

  constructor(
    private auth: Auth,
    private abtest: ABTest,
    private datastore: Datastore,
    private featureFlagService: FeatureFlagsService,
    private localization: Localization,
  ) {}

  ngOnInit() {
    this.isGiveGetEligible$ = this.datastore
      .document<ReferralInvitationCheckCollection>(
        'referralInvitationCheck',
        this.auth.getUserId(),
      )
      .valueChanges()
      .pipe(map(result => result.isEligible));

    this.userCountry$ = this.datastore
      .document<UsersSelfCollection>('usersSelf', this.auth.getUserId())
      .valueChanges()
      .pipe(
        map(result =>
          result.address !== undefined && result.address.country !== undefined
            ? result.address.country
            : '',
        ),
      );

    this.showGiveButton$ = Rx.combineLatest([
      this.isGiveGetEligible$,
      this.userCountry$,
      this.featureFlagService.getFlag(Feature.GIVE_GET),
    ]).pipe(
      switchMap(([isGiveGetEligible, userCountry, featureFlag]) => {
        // Show give button on navbar when the whitelist cookie is set.
        if (this.abtest.isWhitelistUser()) {
          return Rx.of(true);
        }

        return Rx.of(
          // User who is in the US.
          userCountry === 'United States' &&
            // English user.
            this.localization.isEnglish() &&
            // Have give get feature flag enabled.
            featureFlag &&
            // Eligible to the give get program.
            isGiveGetEligible,
        );
      }),
    );
  }
}
