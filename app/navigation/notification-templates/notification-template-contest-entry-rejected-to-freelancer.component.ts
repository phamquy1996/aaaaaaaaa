import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryRejectedToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-rejected-to-freelancer',
  template: `
    <ng-container
      i18n="Notification template contest entry rejected to freelancer"
    >
      Your entry was rejected for <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryRejectedToFreelancerComponent {
  @Input() event: NotificationContestEntryRejectedToFreelancer;
}
