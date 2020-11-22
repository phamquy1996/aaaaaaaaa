import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationNotifyFollower } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-follower',
  template: `
    <ng-container i18n="Notification template follower">
      <strong>{{ event.data.username }}</strong> posted
      <strong>{{ event.data.title }}</strong
      >. {{ event.data.jobString }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateFollowerComponent {
  @Input() event: NotificationNotifyFollower;
}
