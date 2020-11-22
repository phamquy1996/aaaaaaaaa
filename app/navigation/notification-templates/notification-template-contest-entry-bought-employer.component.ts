import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntryBoughtToEmployer } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry-bought-employer',
  template: `
    <ng-container i18n="Notification template contest entry bought employer">
      You've purchased
      <strong>
        {{ event.data.publicName || event.data.username }}'s entry #{{
          event.data.entryNumber
        }}
      </strong>
      for <strong>{{ event.data.contestName }}</strong
      >! Complete the contest handover to own it legally!
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryBoughtEmployerComponent {
  @Input() event: NotificationContestEntryBoughtToEmployer;
}
