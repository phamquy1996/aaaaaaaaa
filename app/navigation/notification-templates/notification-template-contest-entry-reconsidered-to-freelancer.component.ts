import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryReconsideredToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector:
    'app-notification-template-contest-entry-reconsidered-to-freelancer',
  template: `
    <ng-container
      i18n="Notification template contest entry reconsidered to freelancer"
    >
      Your entry was reconsidered for
      <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryReconsideredToFreelancerComponent {
  @Input() event: NotificationContestEntryReconsideredToFreelancer;
}
