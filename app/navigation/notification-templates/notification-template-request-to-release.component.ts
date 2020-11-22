import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationRequestToRelease } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-request-to-release',
  template: `
    <ng-container
      *ngIf="event.data.currencyCode !== 'TKN'; else tokenText"
      i18n="Notification template request to release"
    >
      <strong>{{ event.data.publicName || event.data.username }}</strong>
      requested to release the milestone payment of
      <fl-currency [code]="event.data.currencyCode" [value]="event.data.amount">
      </fl-currency>
      for project <strong>{{ event.data.name }}</strong
      >.
    </ng-container>
    <ng-template #tokenText>
      <ng-container i18n="Notification template request to release">
        <strong>{{ event.data.publicName || event.data.username }}</strong>
        requested to release the milestone of
        {{ event.data.amount | flCurrency: event.data.currencyCode }} for
        project <strong>{{ event.data.name }}</strong
        >.
      </ng-container>
    </ng-template>

    <ng-container
      *ngIf="event.data.state === 'accept'"
      i18n="Notification template request to release"
    >
      <strong>Milestone Released.</strong>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateRequestToReleaseComponent {
  @Input() event: NotificationRequestToRelease;
}
