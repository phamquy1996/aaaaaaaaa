import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAwardReminder } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award-reminder',
  template: `
    <ng-container i18n="Notification template award reminder">
      Not sure who to award? {{ event.data.username }} is currently the best
      freelancer for {{ event.data.name }}. Award them now!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardReminderComponent {
  @Input() event: NotificationAwardReminder;
}
