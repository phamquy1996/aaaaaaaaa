import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAwardXp } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award-xp',
  template: `
    <ng-container i18n="Notification template award XP">
      <span *ngIf="event.data.amount > 0">+</span> {{ event.data.amount }} XP!
      {{ event.data.descr }}!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardXpComponent {
  @Input() event: NotificationAwardXp;
}
