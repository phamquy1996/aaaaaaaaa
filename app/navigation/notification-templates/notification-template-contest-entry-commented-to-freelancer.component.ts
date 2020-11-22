import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryCommentedToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-commented-to-freelancer',
  template: `
    <ng-container
      i18n="Notification template contest entry commmented to freelancer"
    >
      Your entry #{{ event.data.entryNumber }} received a comment on the contest
      <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryCommentedToFreelancerComponent {
  @Input() event: NotificationContestEntryCommentedToFreelancer;
}
