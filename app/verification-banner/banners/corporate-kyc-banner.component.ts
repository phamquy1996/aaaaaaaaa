import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import { UserInteractionsCollection } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-corporate-kyc-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Corporate account verification is required"
      i18n-bannerTitle="Corporate Verification banner title"
      [icon]="'ui-user'"
      [type]="BannerAnnouncementType.INFO"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <fl-banner-announcement-message
        i18n="Corporate Verification banner message"
      >
        You can continue to work, but you won't be able to transfer or withdraw
        funds until you verify your corporate identity.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verify corporate identity button"
          flTrackingLabel="CorporateKycVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/kyc/verification-center-home'"
          [queryParams]="{
            prominentCorporate: true
          }"
        >
          Verify Identity
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateKycBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() containerSize: ContainerSize;
  private CLOSE_EVENT = 'corporate-kyc-banner-CLOSE';

  constructor(private datastore: Datastore) {}

  handleClose() {
    this.datastore.createDocument<UserInteractionsCollection>(
      'userInteractions',
      { eventName: this.CLOSE_EVENT },
    );
  }
}
