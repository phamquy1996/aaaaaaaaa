import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  PhoneVerificationBanner,
  UserInteractionsCollection,
} from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-phone-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Verify your phone number"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-phone'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        This is an essential security check to help protect your identity.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="PhoneVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/phoneverify'"
        >
          Verify via SMS
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() banner: PhoneVerificationBanner;
  @Input() containerSize: ContainerSize;
  private CLOSE_EVENT = 'phone-verification-banner-CLOSE';

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }
}
