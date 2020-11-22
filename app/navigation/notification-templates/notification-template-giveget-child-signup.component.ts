import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationGiveGetChildSignUp } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-giveget-child-signup',
  template: `
    <ng-container
      *ngIf="event.data.childId"
      i18n="Notification template giveget child signup"
    >
      <strong>{{ event.data.childName }}</strong> has signed up via your
      referral link! Once {{ event.data.childName }} gets
      {{
        event.data.bonusRequirement
          | currency: event.data.currencyCode:'symbol':'1.0-0'
      }}
      {{ event.data.currencyCode }} worth of work done, you'll get
      {{
        event.data.bonus | currency: event.data.currencyCode:'symbol':'1.0-0'
      }}
      {{ event.data.currencyCode }} bonus credit. Invite more users to get more
      credit!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateGiveGetChildSignUpComponent {
  @Input() event: NotificationGiveGetChildSignUp;
}
