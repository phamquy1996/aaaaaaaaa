import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReferralBonusBanner } from '@freelancer/datastore/collections';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-referral-bonus-banner',
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
        Your {{ banner.amount | flCurrency: banner.currencyCode }} gift from
        {{ banner.referrer }} will be released to you when you verify your
        payment method.
      </fl-banner-announcement-message>

      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="ReferralBonusVerify"
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
export class ReferralBonusBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;

  @Input() banner: ReferralBonusBanner;
  @Input() containerSize: ContainerSize;
}
