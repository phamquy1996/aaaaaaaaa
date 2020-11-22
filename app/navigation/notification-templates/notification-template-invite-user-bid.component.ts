import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationInviteUserBid } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-invite-user-bid',
  template: `
    <ng-container i18n="Notification template invite user bid">
      <strong>{{ event.data.publicName || event.data.username }}</strong>
      invited you to their project <strong>{{ event.data.title }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateInviteUserBidComponent {
  @Input() event: NotificationInviteUserBid;
}
