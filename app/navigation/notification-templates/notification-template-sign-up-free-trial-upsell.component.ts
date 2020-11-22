import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationSignUpFreeTrialUpsell } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-sign-up-free-trial-upsell',
  template: `
    <ng-container i18n="Notification template sign up free trial upsell">
      Try {{ event.data.trialPackageName }} for Free. It's the smart way to get
      more jobs.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateSignUpFreeTrialUpsellComponent {
  @Input() event: NotificationSignUpFreeTrialUpsell;
}
