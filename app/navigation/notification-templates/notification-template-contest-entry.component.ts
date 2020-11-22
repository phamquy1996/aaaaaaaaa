import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestEntry } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-entry',
  template: `
    <ng-container
      *ngIf="event.data.secondUser"
      i18n="Notification template contest entry"
    >
      {{ event.data.firstUserPublicName || event.data.firstUser }} and
      {{ event.data.secondUserPublicName || event.data.secondUser }} submitted
      entry on {{ event.data.contestName }}.
    </ng-container>
    <ng-container
      *ngIf="!event.data.secondUser"
      i18n="Notification template contest entry"
    >
      {{ event.data.firstUserPublicName || event.data.firstUser }} submitted
      entry on {{ event.data.contestName }}.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestEntryComponent {
  @Input() event: NotificationContestEntry;
}
