import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Currency } from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextTransform } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { BidUpgradeType, UpgradeType } from '@freelancer/ui/upgrade-tag';

@Component({
  selector: 'fl-upgrade-item',
  template: `
    <fl-grid>
      <fl-col [col]="6" [colTablet]="3">
        <ng-container *ngIf="!isLoadingPrice; else loadingPrice">
          <fl-text
            *ngIf="!upgradeApplied && !promoPrice && price && !freeUpgrade"
            [weight]="FontWeight.BOLD"
          >
            {{ price | flCurrency: currency?.code }}
            <fl-tooltip
              *ngIf="tooltip"
              [message]="tooltip"
              [position]="TooltipPosition.TOP_CENTER"
            >
              <fl-icon
                [name]="'ui-help'"
                [color]="IconColor.MID"
                [size]="IconSize.SMALL"
              ></fl-icon>
            </fl-tooltip>
          </fl-text>
          <fl-text
            *ngIf="
              !upgradeApplied && ((!promoPrice && price === 0) || freeUpgrade)
            "
            i18n="Free tag for an upgrade item"
            [textTransform]="TextTransform.UPPERCASE"
            [weight]="FontWeight.BOLD"
          >
            Free
          </fl-text>
          <fl-text
            *ngIf="upgradeApplied && !promoPrice"
            i18n="Project upgrade applied tag"
            [weight]="FontWeight.BOLD"
          >
            Upgrade Applied
          </fl-text>
          <ng-container
            *ngIf="!upgradeApplied && promoPrice && price && !freeUpgrade"
          >
            <fl-text
              i18n="Project upgrade promo price"
              [color]="FontColor.PROMO"
              [weight]="FontWeight.BOLD"
            >
              ONLY
              {{ promoPrice | flCurrency: currency?.code }}
            </fl-text>
            <fl-text
              class="UpgradeItem-price-full"
              i18n="Project upgrade promo price"
              [weight]="FontWeight.BOLD"
              [flMarginBottom]="Margin.SMALL"
              [flMarginBottomDesktop]="Margin.NONE"
            >
              {{ price | flCurrency: currency?.code }}
            </fl-text>
          </ng-container>
        </ng-container>
        <ng-template #loadingPrice>
          <fl-loading-text [rows]="1" [padded]="false"></fl-loading-text>
        </ng-template>
      </fl-col>
      <fl-col [col]="6" [colTablet]="4" [colDesktopLarge]="3" [pull]="'right'">
        <fl-bit class="UpgradeItem">
          <fl-upgrade-tag
            class="UpgradeItem-tag"
            [flMarginBottom]="Margin.SMALL"
            [flMarginBottomDesktop]="Margin.XSMALL"
            [upgradeType]="upgradeType"
          ></fl-upgrade-tag>
        </fl-bit>
      </fl-col>
      <fl-col [col]="12" [colDesktopSmall]="12" [colDesktopLarge]="6">
        <fl-text
          [flMarginBottom]="Margin.SMALL"
          [flMarginBottomDesktop]="Margin.NONE"
        >
          <ng-content></ng-content>
        </fl-text>
      </fl-col>
    </fl-grid>
  `,
  styleUrls: ['./upgrade-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpgradeItemComponent {
  FontWeight = FontWeight;
  FontColor = FontColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextTransform = TextTransform;
  TooltipPosition = TooltipPosition;

  @Input() currency: Currency;
  @Input() freeUpgrade: boolean;
  @Input() isLoadingPrice: boolean;
  @Input() price: number;
  @Input() promoPrice: number;
  @Input() upgradeApplied: boolean;
  @Input() upgradeType: UpgradeType | BidUpgradeType;
  @Input() tooltip: string;
}
