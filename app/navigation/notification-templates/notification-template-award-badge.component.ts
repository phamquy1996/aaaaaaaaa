import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAwardBadge } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award-badge',
  template: `
    <ng-container i18n="Notification template award badge">
      <strong>{{ event.data.name }}:</strong> {{ event.data.descr }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardBadgeComponent {
  @Input() event: NotificationAwardBadge;
}
