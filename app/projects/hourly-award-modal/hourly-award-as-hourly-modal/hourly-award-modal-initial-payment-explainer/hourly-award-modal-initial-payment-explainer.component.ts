import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Currency } from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-hourly-award-modal-initial-payment-explainer',
  template: `
    <fl-bit>
      <fl-heading
        i18n="Heading for setting up initial payment"
        [size]="TextSize.MID"
        [headingType]="HeadingType.H3"
        [flMarginBottom]="Margin.XXXSMALL"
      >
        Set Up Initial Payment
      </fl-heading>
      <fl-text
        i18n="Explaining how initial payment works"
        [flMarginBottom]="Margin.LARGE"
      >
        You are required to make a one time Initial Payment equal to
        {{ initialPaymentRate * 100 }}% of the Maximum Weekly Bill. This Initial
        Payment shows
        <fl-text [fontType]="FontType.SPAN" [weight]="FontWeight.BOLD"
          >{{ freelancerPublicName }}
        </fl-text>
        that you are serious about working together. The money can be returned
        to your account, should you not end up spending it all.
      </fl-text>
    </fl-bit>

    <fl-list>
      <fl-list-item>
        <fl-bit class="InitialPaymentAmount">
          <fl-text
            i18n="Initial payment amount label"
            [fontType]="FontType.SPAN"
            [weight]="FontWeight.BOLD"
          >
            Initial Payment
          </fl-text>
          <fl-text>
            {{ initialPaymentAmount | flCurrency: currency.code }}
          </fl-text>
        </fl-bit>
      </fl-list-item>
    </fl-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./hourly-award-modal-initial-payment-explainer.component.scss'],
})
export class HourlyAwardModalInitialPaymentExplainerComponent {
  HeadingType = HeadingType;
  TextSize = TextSize;
  Margin = Margin;
  FontWeight = FontWeight;
  FontType = FontType;

  @Input() freelancerPublicName: string;
  @Input() initialPaymentAmount: number;
  @Input() currency: Currency;
  // currently we default initial payment to be 50% of maximum weekly payment
  @Input() initialPaymentRate = 0.5;
}
