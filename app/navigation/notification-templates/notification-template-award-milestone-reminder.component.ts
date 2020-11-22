import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAwardMilestoneReminder } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award-milestone-reminder',
  template: `
    <ng-container
      *ngIf="!event.data.isHourlyProject"
      i18n="Notification template award milestone reminder for fixed project"
    >
      You've successfully awarded
      {{ event.data.publicName || event.data.username }}. Create a Milestone now
      to get started
    </ng-container>

    <ng-container
      *ngIf="event.data.isHourlyProject"
      i18n="Notification template award milestone reminder for hourly project"
    >
      You've successfully awarded
      {{ event.data.publicName || event.data.username }}.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardMilestoneReminderComponent {
  @Input() event: NotificationAwardMilestoneReminder;
}
