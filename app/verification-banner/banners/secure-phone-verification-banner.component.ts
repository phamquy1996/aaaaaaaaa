import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { UserInteractionsCollection } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-secure-phone-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Phone verification is required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-phone'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        Please provide a permanent phone number to help us further verify your
        Freelancer.com account.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          [flTrackingLabel]="
            forcePhoneVerification ? 'ForcePhoneVerify' : 'SecurePhoneSetup'
          "
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="
            forcePhoneVerification
              ? '/users/phoneverify'
              : '/users/settings.php'
          "
          [queryParams]="
            forcePhoneVerification
              ? undefined
              : {
                  phoneverify: true
                }
          "
        >
          Verify Phone Number
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurePhoneVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() containerSize: ContainerSize;
  @Input() forcePhoneVerification: boolean;
  private FORCE_PHONE_CLOSE_EVENT = 'force-phone-verification-banner-CLOSE';
  private SECURE_PHONE_CLOSE_EVENT = 'secure-phone-setup-banner-CLOSE';

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      {
        eventName: this.forcePhoneVerification
          ? this.FORCE_PHONE_CLOSE_EVENT
          : this.SECURE_PHONE_CLOSE_EVENT,
      },
    );
  }
}
