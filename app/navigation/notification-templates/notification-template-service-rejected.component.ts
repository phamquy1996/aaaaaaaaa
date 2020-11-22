import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationServiceRejected } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-service-rejected',
  template: `
    <ng-container i18n="Notification template service rejected">
      We have provided some feedback for your service
      <strong>{{ event.data.serviceName }}</strong
      >. Please update your service and submit it again for review.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateServiceRejectedComponent {
  @Input() event: NotificationServiceRejected;
}
