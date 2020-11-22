import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';

@Component({
  selector: 'app-tcs-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Please provide your GSTIN"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-document'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
    >
      <ng-container i18n="Verification banner message">
        As per Indian government regulations, freelancers are required to
        provide GST details for Tax Collected at Source (TCS) purposes.
      </ng-container>
      <fl-link
        i18n="Verification banner call to action"
        flTrackingLabel="TcsVerify.Help"
        [color]="LinkColor.LIGHT"
        [hoverColor]="LinkHoverColor.LIGHT"
        [underline]="LinkUnderline.ALWAYS"
        [link]="
          '/support/Payments/tax-collected-at-source-tcs-for-indian-freelancers'
        "
      >
        Learn more
      </fl-link>
      <!-- slap other link on a newline -->
      <fl-bit>
        <fl-link
          i18n="Verification banner call to action"
          flTrackingLabel="TcsVerify.Update"
          [color]="LinkColor.LIGHT"
          [hoverColor]="LinkHoverColor.LIGHT"
          [underline]="LinkUnderline.ALWAYS"
          [link]="'/users/settings.php'"
          [fragment]="'PaymentSettings'"
        >
          Update your GSTIN
        </fl-link>
      </fl-bit>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TcsVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;

  @Input() containerSize: ContainerSize;
}
