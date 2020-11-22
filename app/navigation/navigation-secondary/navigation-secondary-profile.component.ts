import { Component } from '@angular/core';
import { Feature } from '@freelancer/feature-flags';
import { ButtonColor } from '@freelancer/ui/button';

@Component({
  selector: 'app-navigation-secondary-profile',
  template: `
    <app-bar
      i18n-appBarTitle="Secondary navigation my profile bar title"
      appBarTitle="My Profile"
      link="/me"
      flTrackingSection="SubnavProfile"
    >
      <!--
        Considering this subnav is only shown on self user's profile page
        just highlight Improve Profile permanently
      -->
      <app-bar-item
        link="/me"
        i18n="Secondary navigation my profile bar item"
        flTrackingLabel="ImproveProfile"
        [linkIsActive]="true"
      >
        Improve Profile
      </app-bar-item>
      <app-bar-item
        *flFeature="Feature.SERVICES"
        link="/services/dashboard.php"
        i18n="Secondary navigation my profile bar item"
        flTrackingLabel="MyServices"
        [exactLink]="true"
      >
        My Services
      </app-bar-item>
      <app-bar-item
        *flFeature="Feature.EXAMS"
        link="/exam/exams/index.php"
        i18n="Secondary navigation my profile bar item"
        flTrackingLabel="GetCerified"
        [queryParams]="{ ttref: 'Exams_Profile' }"
        [exactLink]="true"
      >
        Get Certified
      </app-bar-item>
      <app-bar-item
        *flFeature="Feature.REFER_A_CLIENT"
        link="/hireme"
        i18n="Secondary navigation my profile bar item"
        flTrackingLabel="PromoteProfile"
        [exactLink]="true"
      >
        Promote Profile
      </app-bar-item>
      <app-bar-item
        *flFeature="Feature.GAMIFICATION"
        link="/users/game"
        i18n="Secondary navigation my profile bar item"
        flTrackingLabel="MyRewards"
        [exactLink]="true"
      >
        My Rewards
      </app-bar-item>
    </app-bar>
  `,
})
export class NavigationSecondaryProfileComponent {
  ButtonColor = ButtonColor;
  Feature = Feature;
}
