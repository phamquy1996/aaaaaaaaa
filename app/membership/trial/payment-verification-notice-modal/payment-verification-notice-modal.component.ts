import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <fl-bit
      class="NoticeModal-container"
      flTrackingSection="PaymentVerificationNoticeModal"
    >
      <fl-bit [flMarginBottom]="Margin.XLARGE">
        <fl-text
          i18n="Free trial just one more step title"
          [flMarginBottom]="Margin.SMALL"
          [size]="TextSize.LARGE"
          [textAlign]="TextAlign.CENTER"
          [weight]="FontWeight.BOLD"
        >
          Just one more step
        </fl-text>
        <fl-text
          i18n="Verify a payment method"
          [size]="TextSize.SMALL"
          [textAlign]="TextAlign.CENTER"
        >
          Verify a payment method
        </fl-text>
      </fl-bit>
      <fl-picture
        class="NoticeModal-image"
        alt="Payment verification image"
        i18n-alt="Payment verification image alt"
        [alignCenter]="true"
        [display]="PictureDisplay.BLOCK"
        [flMarginBottom]="Margin.XLARGE"
        [src]="'payments/money_shield.svg'"
      >
      </fl-picture>
      <fl-text
        i18n="Payment verification step additional information"
        [flMarginBottom]="Margin.LARGE"
        [size]="TextSize.XXSMALL"
        [textAlign]="TextAlign.CENTER"
      >
        Don't worry! You will not be charged on your first month and you are
        free to cancel any time. We need to verify your payment method for
        identity and security reasons. It's a quick and easy 2 minute process.
      </fl-text>
      <fl-button
        class="NoticeModal-cta"
        flTrackingLabel="PaymentVerificationNoticeModal.Continue"
        i18n="Continue button"
        [color]="ButtonColor.SECONDARY"
        [link]="'/verify'"
        [queryParams]="{
          w: 't',
          next: '/membership/trial?w=t&startTrial=true'
        }"
        [size]="ButtonSize.LARGE"
      >
        Continue
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./payment-verification-notice-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerificationNoticeModalComponent {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  FontWeight = FontWeight;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
  TextAlign = TextAlign;
  TextSize = TextSize;
}
