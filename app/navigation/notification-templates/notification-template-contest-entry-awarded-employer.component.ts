import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestAwardedToEmployer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-awarded-employer',
  template: `
    <ng-container i18n="Notification template contest entry awarded employer">
      You've selected
      <strong
        >{{ event.data.publicName || event.data.username }}'s entry
        {{ event.data.entryNumber }}</strong
      >
      as winning entry for your contest
      <strong>{{ event.data.contestName }}</strong
      >! Complete the contest handover now to own it legally!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryAwardedEmployerComponent {
  @Input() event: NotificationContestAwardedToEmployer;
}
