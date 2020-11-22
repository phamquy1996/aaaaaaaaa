import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';
import { LinkColor, LinkHoverColor, LinkUnderline } from '@freelancer/ui/link';

@Component({
  selector: 'app-force-credit-card-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Credit card authentication required"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-credit-card-v2'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
      (close)="handleClose()"
    >
      <ng-container i18n="Verification banner message">
        To keep Freelancer.com a trusted and secure marketplace, we require you
        to authenticate the ownership of your credit card. Becoming
        authenticated helps you attract the best freelancers on the platform.
      </ng-container>
      <fl-link
        i18n="Verification banner call to action"
        flTrackingLabel="ForceCreditCardVerify"
        [color]="LinkColor.LIGHT"
        [hoverColor]="LinkHoverColor.LIGHT"
        [underline]="LinkUnderline.ALWAYS"
        [link]="'/payments-and-trust'"
        [fragment]="'/authenticate-your-cards'"
      >
        Authenticate card
      </fl-link>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForceCreditCardVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;

  @Input() containerSize: ContainerSize;

  handleClose() {
    // TODO: save close state
  }
}
