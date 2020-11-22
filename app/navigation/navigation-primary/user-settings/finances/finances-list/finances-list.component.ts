import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserBalance } from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkIconPosition } from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';

@Component({
  selector: 'app-finances-list',
  template: `
    <fl-bit class="Heading">
      <fl-text
        i18n="Finances heading"
        [flMarginRight]="Margin.MID"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
        [weight]="FontWeight.BOLD"
      >
        Finances
      </fl-text>
      <fl-link
        flTrackingLabel="Finances-Manage"
        i18n="Finances manage"
        [iconName]="'ui-arrow-right'"
        [iconPosition]="LinkIconPosition.RIGHT"
        [iconSize]="IconSize.XSMALL"
        [link]="'/users/financial-dash/'"
        [size]="TextSize.XXSMALL"
      >
        Manage
      </fl-link>
    </fl-bit>

    <fl-list
      [padding]="ListItemPadding.SMALL"
      [type]="ListItemType.NON_BORDERED"
    >
      <fl-list-item>
        <fl-text i18n="Finances balances"> Balances </fl-text>
        <fl-list
          [padding]="ListItemPadding.SMALL"
          [type]="ListItemType.NON_BORDERED"
        >
          <fl-list-item *ngIf="defaultBalance">
            <fl-text [color]="FontColor.MID">
              {{
                defaultBalance.amount | flCurrency: defaultBalance.currency.code
              }}
            </fl-text>
          </fl-list-item>
          <fl-list-item *ngFor="let userBalance of otherUserBalances">
            <fl-text [color]="FontColor.MID">
              {{ userBalance.amount | flCurrency: userBalance.currency.code }}
            </fl-text>
          </fl-list-item>
          <fl-list-item *ngIf="hasMoreBalances">
            <fl-link
              flTrackingLabel="Finances-ViewAllBalances"
              i18n="Finances view all balances"
              [iconName]="'ui-arrow-right'"
              [iconPosition]="LinkIconPosition.RIGHT"
              [link]="'/users/financial-dash/'"
            >
              View More
            </fl-link>
          </fl-list-item>
        </fl-list>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Finances deposit funds"
          flTrackingLabel="Finances-DepositFunds"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/deposit'"
        >
          Deposit Funds
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Finances withdraw funds"
          flTrackingLabel="Finances-WithdrawFunds"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/payments/withdraw.php'"
        >
          Withdraw Funds
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Finances transaction history"
          flTrackingLabel="Finances-TransactionHistory"
          [color]="LinkColor.DARK"
          [link]="'/payments/transactions.php'"
        >
          Transaction History
        </fl-link>
      </fl-list-item>
      <fl-list-item>
        <fl-link
          i18n="Financial Dashboard"
          flTrackingLabel="Finances-FinancialDashboard"
          [color]="LinkColor.DARK"
          [flMarginBottom]="Margin.SMALL"
          [link]="'/users/financial-dash/'"
        >
          Financial Dashboard
        </fl-link>
      </fl-list-item>
    </fl-list>
  `,
  styleUrls: ['./finances-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesListComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkIconPosition = LinkIconPosition;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  Margin = Margin;
  TextTransform = TextTransform;

  @Input() defaultBalance: UserBalance;
  @Input() otherUserBalances: ReadonlyArray<UserBalance>;
  @Input() hasMoreBalances = false;
}
