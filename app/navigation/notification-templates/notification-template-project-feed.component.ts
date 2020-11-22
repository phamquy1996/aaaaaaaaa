import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectFeedEntry } from '@freelancer/datastore/collections';
import { BudgetLength } from '@freelancer/ui/budget.component';
import { FontColor, FontWeight } from '@freelancer/ui/text';

@Component({
  selector: 'app-notification-template-project-feed',
  template: `
    <ng-container i18n="notification template project feed">
      <fl-text
        class="NotificationDetail"
        [weight]="FontWeight.BOLD"
        [color]="textColor"
      >
        {{ event.title }}
      </fl-text>
      <fl-text class="NotificationDetail" [color]="textColor">
        {{ event.jobString }}
      </fl-text>
      <fl-bit *ngIf="!hasNoBudget && event.currencyCode !== 'TKN'">
        <fl-budget
          [min]="event.minBudget"
          [max]="event.maxBudget"
          [currencyCode]="event.currencyCode"
          [length]="BudgetLength.LONG"
        ></fl-budget>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./notification-template-project-feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateProjectFeedComponent {
  BudgetLength = BudgetLength;
  FontWeight = FontWeight;

  @Input() event: ProjectFeedEntry;
  @Input() hasNoBudget = false;
  @Input() lightColor = false;

  get textColor() {
    return this.lightColor ? FontColor.LIGHT : FontColor.DARK;
  }
}
