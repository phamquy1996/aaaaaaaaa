import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  PendingInformationRequestBanner,
  UserInteractionsCollection,
} from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-pending-information-request-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Additional account information is required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-document'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        To avoid account limitations, please update your account information
        within the next {{ banner.daysLeft }} days.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="PendingInformationRequestVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/settings.php'"
          [fragment]="'AccountSecurity'"
        >
          Submit Information
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingInformationRequestBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() banner: PendingInformationRequestBanner;
  @Input() containerSize: ContainerSize;
  private CLOSE_EVENT = 'pending-information-request-banner-CLOSE';

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }
}
