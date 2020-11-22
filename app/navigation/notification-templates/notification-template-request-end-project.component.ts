import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationRequestEndProject } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-request-end-project',
  template: `
    <ng-container i18n="Notification template request end project">
      <strong>{{ event.data.publicName || event.data.username }}</strong> has
      requested that you end the project <strong>{{ event.data.name }}</strong
      >.
    </ng-container>

    <ng-container i18n="Notification template request end project">
      If this is an inappropriate time to end your project, please ask
      {{ event.data.publicName || event.data.username }} to withdraw their
      request.
    </ng-container>

    <ng-container
      *ngIf="event.data.dayCount"
      i18n="Notification template request end project"
      >> Otherwise this will be closed in
      <strong>{{ event.data.dayCount }} days'</strong> time.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateRequestEndProjectComponent {
  @Input() event: NotificationRequestEndProject;
}
