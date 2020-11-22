import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAwardCredit } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award-credit',
  template: `
    <ng-container i18n="Notification template award credit">
      <span *ngIf="event.data.amount > 0">+</span>
      {{ event.data.amount }} Credits!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardCreditComponent {
  @Input() event: NotificationAwardCredit;
}
