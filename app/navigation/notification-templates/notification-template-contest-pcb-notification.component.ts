import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestPCBNotification } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-pcb-notification',
  template: `
    <ng-container i18n="Notification template contest pcb notification">
      {{ event.data.firstUserPublicName || event.data.firstUser }}
      <ng-container *ngIf="event.data.userCount > 1">
        and
        <ng-container *ngIf="event.data.userCount == 2; else moreThanTwoUsers">
          {{ event.data.secondUserPublicName || event.data.secondUser }}
        </ng-container>
        <ng-template #moreThanTwoUsers>
          {{ event.data.userCount - 1 }} others
        </ng-template>
      </ng-container>
      posted on the clarification board for {{ event.data.contestName }}.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestPcbNotificationComponent {
  @Input() event: NotificationContestPCBNotification;
}
