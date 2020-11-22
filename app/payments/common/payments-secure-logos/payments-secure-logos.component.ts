import { Component } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-payments-secure-logo',
  styleUrls: ['./payments-secure-logos.component.scss'],
  template: `
    <fl-bit class="SecureLogos">
      <fl-picture
        [flMarginRight]="Margin.MID"
        i18n-alt="MasterCard Secure Logo"
        alt="MasterCard Secure Logo"
        [src]="'payments/secure/mastercard-securecode.svg'"
      ></fl-picture>
      <fl-picture
        class="VisaLogo"
        i18n-alt="Visa Secure Logo"
        alt="Visa Secure Logo"
        [src]="'payments/secure/visa-secure-blu.svg'"
      ></fl-picture>
    </fl-bit>
  `,
})
export class PaymentsSecureLogosComponent {
  Margin = Margin;
}
