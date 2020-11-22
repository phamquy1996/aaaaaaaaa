import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryRatedToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-rated-to-freelancer',
  template: `
    <ng-container
      *ngIf="event.data.hasOtherEntriesRatedOrRejected"
      i18n="Notification template contest entry rated to freelancer"
    >
      {{ event.data.ratedOrRejectedEntriesCount }} of your entries were rated
      for <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
    <ng-container
      *ngIf="!event.data.hasOtherEntriesRatedOrRejected"
      i18n="Notification template contest entry rated to freelancer"
    >
      Your entry was rated for <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryRatedToFreelancerComponent {
  @Input() event: NotificationContestEntryRatedToFreelancer;
}
