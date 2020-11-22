import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CardBorderRadius } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor } from '@freelancer/ui/icon';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-payment-verify-benefits',
  template: `
    <fl-card
      [borderRadius]="CardBorderRadius.LARGE"
      [flMarginBottom]="Margin.LARGE"
      [expandable]="expandable"
    >
      <fl-card-header-title *ngIf="expandable">
        <fl-heading
          i18n="verification benefits title"
          [headingType]="HeadingType.H2"
          [size]="TextSize.SMALL"
        >
          Verified Payment Method Benefits
        </fl-heading>
      </fl-card-header-title>
      <fl-heading
        *ngIf="!expandable"
        i18n="verification benefits title"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.MID"
      >
        Verified Payment Method Benefits
      </fl-heading>
      <fl-list [type]="ListItemType.NON_BORDERED">
        <fl-list-item>
          <fl-bit class="BenefitItem">
            <fl-picture
              alt="Verified badge"
              i18n-alt="verification benefit icon"
              [src]="'payments/money_shield.svg'"
              [flMarginRight]="Margin.MID"
            ></fl-picture>
            <fl-bit>
              <fl-heading
                i18n="verificataion benefit"
                [size]="TextSize.MID"
                [headingType]="HeadingType.H3"
              >
                Verified badge
              </fl-heading>
              <fl-text i18n="verification benefit description">
                Improve your trust on the platform with a payment verified
                badge.
              </fl-text>
            </fl-bit>
          </fl-bit>
        </fl-list-item>
        <fl-list-item>
          <fl-bit class="BenefitItem">
            <fl-picture
              alt="Success target"
              i18n-alt="verification benefit icon"
              [src]="'payments/target.svg'"
              [display]="PictureDisplay.BLOCK"
              [flMarginRight]="Margin.MID"
            ></fl-picture>
            <fl-bit>
              <fl-heading
                i18n="verification benefit"
                [size]="TextSize.MID"
                [headingType]="HeadingType.H3"
              >
                Concentrate on success
              </fl-heading>
              <fl-text i18n="verification benefit description">
                Bid, post projects, make payments easier and improve your
                productivity
              </fl-text>
            </fl-bit>
          </fl-bit>
        </fl-list-item>
      </fl-list>
    </fl-card>
  `,
  styleUrls: ['./payment-verify-benefits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerifyBenefitsComponent {
  CardBorderRadius = CardBorderRadius;
  TextSize = TextSize;
  HeadingType = HeadingType;
  IconColor = IconColor;
  ListItemType = ListItemType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;

  @Input() expandable = false;
}
