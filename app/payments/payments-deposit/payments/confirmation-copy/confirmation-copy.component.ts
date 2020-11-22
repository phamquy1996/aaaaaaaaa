import { Component, Input } from '@angular/core';
import { TextSize } from '@freelancer/ui/text';
import { DepositMethodApi } from 'api-typings/payments/payments';

@Component({
  selector: 'app-confirmation-copy',
  template: `
    <ng-container [ngSwitch]="selectedDepositMethod">
      <fl-bit *ngSwitchCase="DepositMethodApi.PAYPAL_REFERENCE">
        <fl-text
          class="ConfirmationCopy"
          i18n="Paypal verification agreement"
          [size]="TextSize.XXSMALL"
        >
          You agree to authorize the use of your PayPal account for this deposit
          and future payments.
        </fl-text>
        <fl-text
          class="ConfirmationCopy"
          i18n="Paypal verification disclaimer"
          [size]="TextSize.XXSMALL"
        >
          PayPal does not support Prepaid and gift cards as a funding source.
        </fl-text>
      </fl-bit>
      <fl-text
        class="ConfirmationCopy"
        *ngSwitchCase="DepositMethodApi.FLN_BILLING"
        i18n="Credit card verification agreement"
        [size]="TextSize.XXSMALL"
      >
        You agree to authorize the use of your card for this deposit and future
        payments.
      </fl-text>
    </ng-container>
    <fl-text
      class="ConfirmationCopy"
      *ngIf="showNativeChargeCopy && nativeChargeCopy"
      i18n="Exchange rate information"
      [size]="TextSize.XXSMALL"
    >
      You will be charged in {{ nativeChargeCopy }}
    </fl-text>
  `,
  styleUrls: ['./confirmation-copy.component.scss'],
})
export class ConfirmationCopyComponent {
  DepositMethodApi = DepositMethodApi;
  TextSize = TextSize;
  @Input() selectedDepositMethod: DepositMethodApi;
  @Input() nativeChargeCopy: string;
  @Input() showNativeChargeCopy: boolean;
}
