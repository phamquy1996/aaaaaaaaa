import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-californian-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Update your profile information"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-pin-location'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
    >
      <fl-banner-announcement-message i18n="Verification banner message">
        We detected that you are a resident of California. Kindly update your
        profile information by going to the Settings page.
      </fl-banner-announcement-message>
      <fl-banner-announcement-buttons>
        <fl-button
          i18n="Verification banner call to action"
          [flTrackingLabel]="'CalifornianVerify'"
          [color]="ButtonColor.TRANSPARENT_LIGHT"
          [size]="ButtonSize.SMALL"
          [link]="'/users/settings.php'"
        >
          Go To Settings
        </fl-button>
      </fl-banner-announcement-buttons>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalifornianVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;

  @Input() containerSize: ContainerSize;
}
