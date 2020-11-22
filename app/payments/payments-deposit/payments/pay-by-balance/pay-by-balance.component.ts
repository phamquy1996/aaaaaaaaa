import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Currency, UserBalance } from '@freelancer/datastore/collections';
import {
  PaymentsEventType,
  PaymentsMessagingService,
  PaymentsResultStatus,
} from '@freelancer/payments-messaging';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { CardBorderRadius } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { delay, map, take, tap } from 'rxjs/operators';
import { DepositContext } from '../../../common/types';
import { roundCurrency } from '../payments.helpers';
import { ConfirmationRows, Row } from '../table/table.component';

@Component({
  selector: 'app-pay-by-balance',
  template: `
    <fl-grid>
      <fl-col [colTablet]="6">
        <fl-card
          [borderRadius]="CardBorderRadius.LARGE"
          [edgeToEdge]="true"
          [flMarginBottom]="Margin.SMALL"
        >
          <fl-list>
            <fl-list-item class="BalancesCard">
              <app-source-template-header [flMarginBottom]="Margin.SMALL">
                <app-source-template-header-title
                  i18n="Pay By balance - user balance label"
                >
                  Your Balance
                </app-source-template-header-title>
                <fl-text
                  *ngIf="{
                    totalBalance: totalBalance$ | async,
                    chargeCurrency: chargeCurrency$ | async
                  } as equivalentData"
                  i18n="Pay By balance - user balance equivalent in currency"
                  [size]="TextSize.XXSMALL"
                >
                  equivalent
                  {{
                    equivalentData.totalBalance
                      | flCurrency: equivalentData.chargeCurrency.code:true
                  }}
                </fl-text>
              </app-source-template-header>
              <app-source-template-body>
                <fl-list>
                  <fl-list-item
                    *ngFor="let balance of userNonZeroBalances$ | async"
                  >
                    <fl-bit class="BalanceItem">
                      <fl-bit class="BalanceItem-currency">
                        <fl-flag
                          [country]="balance.currency.country | lowercase"
                          [flMarginRight]="Margin.XSMALL"
                        ></fl-flag>
                        <fl-text> {{ balance.currency.name }} </fl-text>
                      </fl-bit>
                      <fl-text [size]="TextSize.XXSMALL">
                        {{
                          balance.amount
                            | flCurrency: balance.currency.code:true
                        }}
                      </fl-text>
                    </fl-bit>
                  </fl-list-item>
                </fl-list>
              </app-source-template-body>
            </fl-list-item>
          </fl-list>
        </fl-card>
      </fl-col>
      <fl-col [colTablet]="6">
        <fl-card [borderRadius]="CardBorderRadius.LARGE">
          <app-table
            [flMarginBottom]="Margin.MID"
            [rows]="rows$ | async"
          ></app-table>
          <app-confirmation-button
            i18n-copy="Confirmation Button"
            copy="Confirm and pay"
            [amount]="chargeAmount$ | async"
            [currency]="chargeCurrency$ | async"
            [buttonDisabled]="!(chargeAmount$ | async)"
            [depositFormGroup]="depositFormGroup"
            (confirmation)="onConfirmationClick()"
          ></app-confirmation-button>
        </fl-card>
      </fl-col>
    </fl-grid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./pay-by-balance.component.scss'],
})
export class PayByBalanceComponent implements OnInit, OnDestroy {
  Margin = Margin;
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  CardBorderRadius = CardBorderRadius;
  TextSize = TextSize;
  HeadingType = HeadingType;
  ListItemType = ListItemType;

  userNonZeroBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;

  @Input() chargeAmount$: Rx.Observable<number>;
  @Input() chargeCurrency$: Rx.Observable<Currency>;
  @Input() depositContext$: Rx.Observable<DepositContext>;
  @Input() totalBalance$: Rx.Observable<number>;
  @Input() userBalances$: Rx.Observable<ReadonlyArray<UserBalance>>;

  busy = false;
  depositFormGroup = new FormGroup({});
  rows$: Rx.Observable<ReadonlyArray<Row>>;
  pageInitializedSubscription?: Rx.Subscription;

  constructor(private paymentsMessaging: PaymentsMessagingService) {}

  ngOnInit() {
    this.userNonZeroBalances$ = this.userBalances$.pipe(
      map(userBalances =>
        userBalances.filter(balance => roundCurrency(balance.amount) !== 0),
      ),
    );

    this.rows$ = Rx.combineLatest([
      this.chargeAmount$,
      this.chargeCurrency$,
      this.depositContext$,
    ]).pipe(
      map(([chargeAmount, chargeCurrency, depositContext]) => [
        ...(depositContext.items !== undefined &&
        depositContext.items.length > 0
          ? [
              {
                type: ConfirmationRows.TITLE,
                underline: true,
              },
            ]
          : []),
        ...(depositContext.items
          ? depositContext.items.map(dcItem => ({
              type: ConfirmationRows.ITEM,
              itemCopy: dcItem.description,
              contextType: dcItem.contextType,
              amount: dcItem.amount,
              currency: chargeCurrency,
              isHourlyInvoiceMilestoneItem: dcItem.isHourlyInvoiceMilestoneItem,
            }))
          : [
              {
                type: ConfirmationRows.DEPOSIT_AMOUNT,
                amount: chargeAmount,
                currency: chargeCurrency,
              },
            ]),
        {
          type: ConfirmationRows.TOTAL,
          amount: chargeAmount,
          currency: chargeCurrency,
          underline: false,
        },
      ]),
    );

    const pageInitialized$ = Rx.combineLatest([
      this.userNonZeroBalances$,
      this.rows$,
    ]).pipe(
      take(1),
      // motivation for delay(0), although not strictly similar scenario
      // it might not work without it since we're possibly emiting during the initialization of the parent component
      // delay(0) skips the tick, an relavent example in setTimeout -
      // https://angular.io/guide/component-interaction#parent-calls-an-viewchild
      delay(0),
      tap(() =>
        this.paymentsMessaging.pushEvent({
          eventType: PaymentsEventType.INITIALIZED,
        }),
      ),
    );

    this.pageInitializedSubscription = pageInitialized$.subscribe();
  }

  ngOnDestroy() {
    if (this.pageInitializedSubscription) {
      this.pageInitializedSubscription.unsubscribe();
    }
  }

  onConfirmationClick() {
    this.paymentsMessaging.pushResult({
      paymentsStatus: PaymentsResultStatus.SUCCESS,
    });
  }
}
