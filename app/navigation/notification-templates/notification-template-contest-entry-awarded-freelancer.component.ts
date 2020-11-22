import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestAwardedToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-awarded-freelancer',
  template: `
    <ng-container i18n="Notification template contest entry awarded freelancer">
      Congratulations! Your
      <strong>entry #{{ event.data.entryNumber }}</strong> was selected as
      winning entry for <strong>{{ event.data.contestName }}</strong
      >! Complete the contest handover now to receive your prize!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryAwardedFreelancerComponent {
  @Input() event: NotificationContestAwardedToFreelancer;
}
