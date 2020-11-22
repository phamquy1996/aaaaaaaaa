import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationInviteToContest } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-invite-to-contest',
  template: `
    <ng-container i18n="Notification template invite to contest">
      <strong>{{ event.data.buyerPublicName || event.data.buyerName }}</strong>
      invited you to their contest: <strong>{{ event.data.title }}</strong
      >.
    </ng-container>
    <ng-container i18n="Notification template invite to contest">
      Win a prize of
      <fl-currency
        [code]="event.data.currencyCode"
        [value]="event.data.prize"
      ></fl-currency
      >.
    </ng-container>
    <ng-container i18n="Notification template invite to contest">
      Enter now!
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateInviteToContestComponent {
  @Input() event: NotificationInviteToContest;
}
