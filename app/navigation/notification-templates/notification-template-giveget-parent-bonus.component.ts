import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationGiveGetParentBonus } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-giveget-parent-bonus',
  template: `
    <ng-container i18n="Notification template giveget parent bonus">
      You just earned
      {{
        event.data.bonus | currency: event.data.currencyCode:'symbol':'1.0-0'
      }}
      {{ event.data.currencyCode }} in bonus credit! Invite more users to earn
      more bonus credit.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateGiveGetParentBonusComponent {
  @Input() event: NotificationGiveGetParentBonus;
}
