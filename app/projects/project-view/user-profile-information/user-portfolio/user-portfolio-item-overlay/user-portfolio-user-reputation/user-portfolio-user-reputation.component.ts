import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  FreelancerReputation,
  LocalHourlyRate,
} from '@freelancer/datastore/collections';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-user-portfolio-user-reputation',
  template: `
    <fl-bit [flMarginBottom]="Margin.SMALL">
      <fl-rating
        [control]="ratingControl"
        [flMarginBottom]="Margin.XXSMALL"
        [readOnly]="true"
        [reviewCount]="userReputation.entireHistory.reviews"
        [size]="IconSize.SMALL"
      ></fl-rating>
      <fl-earnings
        [earnings]="userReputation.earningsScore"
        [flMarginBottom]="Margin.SMALL"
      ></fl-earnings>
      <fl-text
        *ngIf="localRate"
        i18n="Local hourly rate of user"
        [size]="TextSize.SMALL"
        [weight]="FontWeight.BOLD"
      >
        {{ localRate.currency.sign }}{{ localRate.rate }}
        {{ localRate.currency.code }}/Hour
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./user-portfolio-user-reputation.component.scss'],
})
export class UserPortfolioUserReputationComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconSize = IconSize;
  Margin = Margin;

  ratingControl = new FormControl(0);
  userReputation: FreelancerReputation;

  @Input() localRate?: LocalHourlyRate;

  @Input()
  set reputation(reputation: FreelancerReputation) {
    if (reputation) {
      this.userReputation = reputation;
      this.ratingControl.setValue(this.userReputation.entireHistory.overall);
    }
  }
}
