import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationInvoiceRequested } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-invoice-requested',
  template: `
    <ng-container i18n="Notification template invoice requested">
      <strong>{{ event.data.publicName || event.data.username }}</strong>
      requested an invoice of
      {{ event.data.amount | flCurrency: event.data.currencyCode }}
      for project <strong>{{ event.data.name }}</strong>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateInvoiceRequestedComponent {
  @Input() event: NotificationInvoiceRequested;
}
