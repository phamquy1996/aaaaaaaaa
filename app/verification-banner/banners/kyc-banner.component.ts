import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-kyc-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Account verification is required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-user'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        You can continue to work, but you won't be able to transfer or withdraw
        funds until you verify your account.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verify identity button"
          flTrackingLabel="KycVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/kyc/verification-center-home'"
        >
          Verify Identity
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KycBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() containerSize: ContainerSize;
}
