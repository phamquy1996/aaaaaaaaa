import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  template: `
    <ng-container flTrackingSection="HireMePaymentVerificationModal">
      <fl-picture
        alt="Hire Me Payment Verification Icon"
        i18n-alt="Hire Me Payment Verification Icon"
        [src]="'profile/payment-verification.svg'"
        [flMarginBottom]="Margin.LARGE"
      ></fl-picture>
      <fl-heading
        i18n="Hire Me Payment verification Heading"
        [headingType]="HeadingType.H2"
        [size]="TextSize.LARGE"
      >
        Keep our community safe
      </fl-heading>
      <fl-text
        i18n="Hire Me Payment verification text"
        flTrackingLabel="VerifyPayment"
        [flMarginBottom]="Margin.MID"
        [color]="FontColor.MID"
      >
        Verify your payment method to hire freelancers
      </fl-text>
      <fl-bit [flMarginBottom]="Margin.SMALL">
        <fl-button
          i18n="Hire Me Payment verification verify button"
          class="WiderButton"
          flTrackingLabel="VerifyNowButton"
          [link]="'/payments/verify.php'"
          [queryParams]="{
            successUrl: encodedUrl,
            quickVerify: 'true',
            skipTrial: 'true'
          }"
          [color]="ButtonColor.SECONDARY"
          [size]="ButtonSize.LARGE"
        >
          Verify Now
        </fl-button>
      </fl-bit>
      <fl-link
        i18n="Hire Me Payment verification post project link"
        flTrackingLabel="PostProjectLink"
        [link]="'/post-project'"
      >
        Or post a project and verify later
      </fl-link>
    </ng-container>
  `,
  styleUrls: ['./hire-me-payment-verify-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HireMePaymentVerifyModalComponent {
  ButtonColor = ButtonColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  ButtonSize = ButtonSize;
  FontColor = FontColor;
  Margin = Margin;

  @Input() encodedUrl: string;
}
