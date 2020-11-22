import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationRequestMilestone } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-request-milestone',
  template: `
    <ng-container
      *ngIf="event.data.currencyCode !== 'TKN'; else tokenText"
      i18n="Notification template request milestone"
    >
      <strong>{{ event.data.publicName || event.data.username }}</strong>
      requested a milestone payment of
      <fl-currency [code]="event.data.currencyCode" [value]="event.data.amount">
      </fl-currency>
      for project <strong>{{ event.data.name }}</strong
      >.
    </ng-container>
    <ng-template #tokenText>
      <ng-container i18n="Notification template request milestone">
        <strong>{{ event.data.publicName || event.data.username }}</strong>
        requested a milestone of
        {{ event.data.amount | flCurrency: event.data.currencyCode }} for
        project <strong>{{ event.data.name }}</strong
        >.
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateRequestMilestoneComponent {
  @Input() event: NotificationRequestMilestone;
}
