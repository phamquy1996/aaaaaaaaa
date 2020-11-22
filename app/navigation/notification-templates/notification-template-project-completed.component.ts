import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationProjectCompleted } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-project-completed',
  template: `
    <ng-container i18n="Notification template project completed">
      <strong>{{ event.data.freelancerUsername }}</strong> completed
      <strong>{{ event.data.name }}</strong> please give feedback.
    </ng-container>
    <div
      *ngIf="event.data.state === 'completed'"
      i18n="Notification template project completed"
    >
      Feedback Provided.
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateProjectCompletedComponent {
  @Input() event: NotificationProjectCompleted;
}
