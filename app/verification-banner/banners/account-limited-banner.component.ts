import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-account-limited-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Verification is required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-document'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        You are restricted from transferring or withdrawing funds as your
        account has been limited. Please verify your identity to remove this
        account limitation.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          flTrackingLabel="AccountLimitedVerify"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/limit-account/verification_center.php'"
        >
          Verify Identity
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLimitedBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() containerSize: ContainerSize;
}
