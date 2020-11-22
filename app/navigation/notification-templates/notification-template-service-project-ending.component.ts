import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationServiceProjectEndingSeller } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-service-project-ending',
  template: `
    <ng-container
      *ngIf="event.data.hoursRemaining <= 0"
      i18n="Notification template service project ending"
    >
      This is a reminder that you have an order due {event.data.hoursRemaining,
      plural, =0 {now} =1 {1 hour} other {{{event.data.hoursRemaining}} hours}}.
    </ng-container>

    <ng-container i18n="Notification template service project ending">
      <strong>{{ event.data.serviceName }}</strong> ordered by
      <strong>{{ event.data.buyerName }}</strong> on
      {{ event.data.orderStartDate }}.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateServiceProjectEndingComponent {
  @Input() event: NotificationServiceProjectEndingSeller;
}
