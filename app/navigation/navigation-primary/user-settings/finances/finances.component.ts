import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { UserBalance } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-finances',
  template: `
    <app-finances-list
      [defaultBalance]="defaultBalance"
      [otherUserBalances]="otherUserBalances"
      [hasMoreBalances]="hasMoreBalances"
    ></app-finances-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancesComponent implements OnChanges {
  @Input() defaultBalance: UserBalance;
  @Input() userBalances: ReadonlyArray<UserBalance>;

  readonly MAX_DISPLAYED_BALANCE = 3;

  otherUserBalances: ReadonlyArray<UserBalance>;
  hasMoreBalances = false;

  ngOnChanges() {
    if (this.userBalances) {
      this.otherUserBalances = this.userBalances
        .filter(balance => !balance.primary)
        .slice(0, 2);

      this.hasMoreBalances =
        this.userBalances.length > this.MAX_DISPLAYED_BALANCE;
    }
  }
}
