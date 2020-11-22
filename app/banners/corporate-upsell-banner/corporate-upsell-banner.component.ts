import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CorporateUpsellBanner } from '@freelancer/datastore/collections';
import { Tracking } from '@freelancer/tracking';
import { Badge, BadgeType, CorporateBadgeType } from '@freelancer/ui/badge';
import { BannerUpsellColor } from '@freelancer/ui/banner-upsell';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: `app-corporate-upsell-banner`,
  template: `
    <fl-banner-upsell
      class="CorporateUpsellBanner"
      [closeable]="closeable"
      [color]="BannerUpsellColor.LIGHT"
      (closeEvent)="closeEvent.emit()"
    >
      <fl-banner-upsell-title
        class="CorporateUpsellBanner-title"
        i18n="Corporate upsell banner title"
      >
        <fl-text
          [color]="FontColor.INHERIT"
          [flMarginRight]="Margin.XXSMALL"
          [fontType]="FontType.CONTAINER"
          [size]="TextSize.INHERIT"
          [weight]="FontWeight.BOLD"
        >
          Freelancer Corporate
        </fl-text>
        <fl-badge
          class="CorporateUpsellBanner-title-badge"
          [badge]="corporateBadge"
        ></fl-badge>
      </fl-banner-upsell-title>
      <fl-banner-upsell-description class="CorporateUpsellBanner-description">
        {{ bodyText }}
      </fl-banner-upsell-description>
      <fl-banner-upsell-button>
        <fl-button
          flTrackingLabel="CorporateUpsellButton"
          [color]="ButtonColor.DEFAULT"
          [link]="corporateUpsellLink"
          [queryParams]="{
            ref: corporateRef
          }"
          [size]="ButtonSize.SMALL"
        >
          {{ buttonLabel }}
        </fl-button>
      </fl-banner-upsell-button>
    </fl-banner-upsell>
  `,
  styleUrls: ['./corporate-upsell-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateUpsellBannerComponent implements AfterViewInit {
  BadgeType = BadgeType;
  CorporateBadgeType = CorporateBadgeType;
  BannerUpsellColor = BannerUpsellColor;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;

  @Input() banner: CorporateUpsellBanner;
  @Input() closeable: true;
  @Input() bodyText: string;
  @Input() buttonLabel: string;
  @Input() corporateRef = 'DashboardUpsell';
  @Output() closeEvent = new EventEmitter<void>();

  corporateBadge: Badge = {
    type: BadgeType.CORPORATE,
    badge: CorporateBadgeType.CORPORATE,
  };

  corporateUpsellLink = '/corporate';

  constructor(private tracking: Tracking) {}

  ngAfterViewInit() {
    this.tracking.track('user_action', {
      label: 'CorporateUpsellView',
    });
  }
}
