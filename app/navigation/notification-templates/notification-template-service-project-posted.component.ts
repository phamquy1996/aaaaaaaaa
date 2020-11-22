import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationServiceProjectPostedSeller } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-service-project-posted',
  template: `
    <ng-container i18n="Notification template service project posted">
      You have received a new order from
      <strong>{{ event.data.buyerPublicName || event.data.buyerName }}</strong>
      for your service <strong>{{ event.data.serviceName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateServiceProjectPostedComponent {
  @Input() event: NotificationServiceProjectPostedSeller;
}
