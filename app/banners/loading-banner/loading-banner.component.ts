import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BannerUpsellColor } from '@freelancer/ui/banner-upsell';

@Component({
  selector: 'app-loading-banner',
  template: `
    <fl-banner-upsell [color]="BannerUpsellColor.DARK" [closeable]="false">
      <fl-banner-upsell-title>
        <fl-loading-text [padded]="false" [rows]="1"></fl-loading-text>
      </fl-banner-upsell-title>
      <fl-banner-upsell-description>
        <fl-loading-text [padded]="false" [rows]="2"></fl-loading-text>
      </fl-banner-upsell-description>
    </fl-banner-upsell>
  `,
  styleUrls: ['./loading-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBannerComponent {
  BannerUpsellColor = BannerUpsellColor;
}
