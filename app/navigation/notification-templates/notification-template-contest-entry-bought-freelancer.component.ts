import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryBoughtToFreelancer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-bought-freelancer',
  template: `
    <ng-container i18n="Notification template contest entry bought freelancer">
      Congratulations! Your
      <strong> entry #{{ event.data.entryNumber }} </strong> was selected as a
      runner up for <strong>{{ event.data.contestName }}</strong
      >! Complete the contest handover now to receive your payment!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryBoughtFreelancerComponent {
  @Input() event: NotificationContestEntryBoughtToFreelancer;
}
