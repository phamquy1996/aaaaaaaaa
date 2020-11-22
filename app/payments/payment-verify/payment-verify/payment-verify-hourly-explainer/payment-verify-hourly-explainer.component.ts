import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardBorderRadius } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { AutomaticBillingInfoContext } from 'app/projects/project-view/project-view-payments/automatic-billing-info/automatic-billing-info.component';

@Component({
  selector: 'app-payment-verify-hourly-explainer',
  template: `
    <fl-card
      [borderRadius]="CardBorderRadius.LARGE"
      [flMarginBottom]="Margin.LARGE"
    >
      <fl-heading
        i18n="Verification explainer title"
        [size]="TextSize.LARGE"
        [headingType]="HeadingType.H2"
        [flMarginBottom]="Margin.MID"
      >
        Why do I need a Verified Payment Method?
      </fl-heading>
      <app-automatic-billing-info
        [context]="AutomaticBillingInfoContext.EMPLOYER_PAYMENT_VERIFY"
      >
      </app-automatic-billing-info>
    </fl-card>
  `,
  styleUrls: ['./payment-verify-hourly-explainer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentVerifyHourlyExplainerComponent {
  AutomaticBillingInfoContext = AutomaticBillingInfoContext;
  CardBorderRadius = CardBorderRadius;
  FontColor = FontColor;
  TextSize = TextSize;
  HeadingType = HeadingType;
  Margin = Margin;
  PictureDisplay = PictureDisplay;
}
