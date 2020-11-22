import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Currency } from '@freelancer/datastore/collections';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { ContextTypeApi } from 'api-typings/payments/payments';

export enum ConfirmationRows {
  DEPOSIT_AMOUNT,
  ITEM,
  LESS_EQUIVALENT_BALANCE,
  PROCESSING_FEE,
  SUBTOTAL,
  TOTAL,
  TITLE,
}

export interface Row {
  amount?: number;
  currency?: Currency;
  type: ConfirmationRows;
  itemCopy?: string;
  info?: string;
  underline?: boolean;
  contextType?: ContextTypeApi;
  isHourlyInvoiceMilestoneItem?: boolean;
}

@Component({
  selector: 'app-table',
  template: `
    <fl-bit
      class="DepositTableRow"
      [ngClass]="{ Underline: row.underline }"
      *ngFor="let row of rows"
    >
      <fl-bit class="DepositTableItem">
        <ng-container [ngSwitch]="row.type">
          <fl-text
            i18n="Table Title"
            *ngSwitchCase="ConfirmationRows.TITLE"
            [weight]="FontWeight.BOLD"
          >
            Item
          </fl-text>
          <fl-text
            i18n="Confirmation Table Row Label"
            *ngSwitchCase="ConfirmationRows.DEPOSIT_AMOUNT"
          >
            Deposit Amount
          </fl-text>
          <fl-bit *ngSwitchCase="ConfirmationRows.ITEM">
            <fl-text class="ItemText" *ngIf="row.itemCopy; else noNameItem">
              {{ row.itemCopy }}
            </fl-text>
            <ng-template #noNameItem>
              <fl-text i18n="Item Name Default">
                Item
              </fl-text>
            </ng-template>
            <app-context-tag [contextType]="row.contextType"> </app-context-tag>
          </fl-bit>
          <fl-text
            i18n="Confirmation Table Row Label"
            *ngSwitchCase="ConfirmationRows.LESS_EQUIVALENT_BALANCE"
          >
            Equivalent Balance
          </fl-text>
          <fl-text
            i18n="Confirmation Table Row Label"
            *ngSwitchCase="ConfirmationRows.PROCESSING_FEE"
            [flMarginRight]="Margin.XXSMALL"
          >
            Processing Fee
          </fl-text>
          <fl-text
            i18n="Confirmation Table Row Label"
            *ngSwitchCase="ConfirmationRows.SUBTOTAL"
            [weight]="FontWeight.BOLD"
          >
            Subtotal
          </fl-text>
          <fl-text
            i18n="Confirmation Table Row Label"
            *ngSwitchCase="ConfirmationRows.TOTAL"
            [weight]="FontWeight.BOLD"
          >
            Total
          </fl-text>
        </ng-container>
        <fl-tooltip
          *ngIf="row.info"
          [message]="row.info"
          [position]="TooltipPosition.TOP_CENTER"
        >
          <fl-icon
            flTrackingLabel="depositFeeToolTip"
            [name]="'ui-help'"
            [color]="IconColor.MID"
            [size]="IconSize.SMALL"
          ></fl-icon>
        </fl-tooltip>
      </fl-bit>
      <fl-bit class="DepositTableAmountCurrency" [ngSwitch]="row.type">
        <fl-text
          *ngSwitchCase="ConfirmationRows.TITLE"
          i18n="Amount"
          class="AmountCurrencyText"
          [weight]="FontWeight.BOLD"
        >
          Amount
        </fl-text>
        <ng-container *ngSwitchDefault>
          <fl-text
            class="AmountCurrencyText"
            i18n="Item Amount"
            *ngIf="row.amount; else freeItem"
          >
            {{ row.amount | flCurrency: row.currency.code:true }}
          </fl-text>
          <ng-template #freeItem>
            <ng-container
              *ngIf="!row.isHourlyInvoiceMilestoneItem; else paidItem"
            >
              <fl-text class="FreeAmountCurrencyText" i18n="Free Item">
                Free
              </fl-text>
            </ng-container>
          </ng-template>
          <ng-template #paidItem>
            <fl-text class="PaidAmountCurrencyText" i18n="Paid Item">
              Paid
            </fl-text>
          </ng-template>
        </ng-container>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  ConfirmationRows = ConfirmationRows;
  Margin = Margin;
  IconColor = IconColor;
  IconSize = IconSize;
  FontWeight = FontWeight;
  FontType = FontType;
  FontColor = FontColor;
  TextSize = TextSize;
  TooltipPosition = TooltipPosition;

  @Input() rows = [] as ReadonlyArray<Row>;
}
