import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationGiveGetChildReceivedSignupBonus } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-giveget-child-received-signup-bonus',
  template: `
    <ng-container i18n="Notification template giveget child bonus">
      Congratulations on getting
      {{
        event.data.bonus | currency: event.data.currencyCode:'symbol':'1.0-0'
      }}
      {{ event.data.currencyCode }}. Invite your friends to earn more!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateGiveGetChildReceivedSignupBonusComponent {
  @Input() event: NotificationGiveGetChildReceivedSignupBonus;
}
