import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationTaskCreate } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-task-create',
  template: `
    <ng-container i18n="Notification on task creation">
      New task "{{ event.data.title }}" has been created.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateTaskCreateComponent {
  @Input() event: NotificationTaskCreate;
}
