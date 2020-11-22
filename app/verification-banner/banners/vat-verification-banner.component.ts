import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BannerAnnouncementType } from '@freelancer/ui/banner-announcement';
import { ContainerSize } from '@freelancer/ui/container';

@Component({
  selector: 'app-vat-verification-banner',
  template: `
    <fl-banner-announcement
      bannerTitle="Please verify your account type"
      i18n-bannerTitle="Verification banner title"
      [icon]="'ui-document'"
      [type]="BannerAnnouncementType.INFO"
      [closeable]="false"
      [containerSize]="containerSize"
    >
      <!-- TODO: two buttons -->
      <ng-container i18n="Verification banner message">
        Do you intend to use Freelancer for personal use? Using Freelancer for
        cases other than business may be subject to additional VAT on fees
        charged by us.
      </ng-container>
    </fl-banner-announcement>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VatVerificationBannerComponent {
  BannerAnnouncementType = BannerAnnouncementType;

  @Input() containerSize: ContainerSize;
}
