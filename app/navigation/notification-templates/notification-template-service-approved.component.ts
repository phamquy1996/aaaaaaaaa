import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationServiceApproved } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-service-approved',
  template: `
    <ng-container i18n="Notification template service approved">
      Congratulations, your service
      <strong>{{ event.data.serviceName }}</strong> has been approved. Promote
      your service now to start receiving orders.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateServiceApprovedComponent {
  @Input() event: NotificationServiceApproved;
}
