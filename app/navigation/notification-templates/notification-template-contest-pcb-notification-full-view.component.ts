import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationContestPCBNotificationFullView } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-contest-pcb-notification-full-view',
  template: `
    <ng-container
      i18n="Notification template contest pcb notification full view"
    >
      <strong>{{
        event.data.firstUserPublicName || event.data.firstUser
      }}</strong>
      <ng-container *ngIf="event.data.userCount > 1">
        and
        <strong>
          <ng-container
            *ngIf="event.data.userCount == 2; else moreThanTwoUsers"
          >
            {{ event.data.secondUserPublicName || event.data.secondUser }}
          </ng-container>
          <ng-template #moreThanTwoUsers>
            {{ event.data.userCount - 1 }} others
          </ng-template>
        </strong>
      </ng-container>
      commented on entry <strong>{{ event.data.entryNumber }}</strong> for
      <strong>{{ event.data.contestName }}</strong
      >.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateContestPcbNotificationFullViewComponent {
  @Input() event: NotificationContestPCBNotificationFullView;
}
