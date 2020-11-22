import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-partnership-payment-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Verify your payment method now"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-credit-card-v2'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="true"
      [containerSize]="containerSize"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        Your gift will be released once you verify your payment method.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="PartnershipPaymentVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [link]="'/payments/verify.php'"
        >
          Add payment method
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipPaymentVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;

  @Input() containerSize: ContainerSize;
}
