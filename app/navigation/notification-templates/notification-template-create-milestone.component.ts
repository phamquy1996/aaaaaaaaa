import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NotificationCreateMilestone } from '@freelancer/datastore/collections';
import { toNumber } from '@freelancer/utils';

@Component({
  selector: 'app-notification-template-create-milestone',
  template: `
    <ng-container
      *ngIf="event?.data?.currencyCode !== 'TKN'; else tokenText"
      i18n="Notification template create milestone"
    >
      {{ event.data.publicName || event.data.username }} created a
      <fl-currency
        [code]="event.data.currencyCode"
        [value]="event.data.amount"
      ></fl-currency>
      milestone payment for project {{ event.data.title }}.
    </ng-container>
    <ng-template #tokenText>
      <fl-text i18n="Notification template create milestone">
        {{ event.data.publicName || event.data.username }} created a milestone
        of {{ amount | flCurrency: event.data.currencyCode }} for project
        {{ event.data.title }}.
      </fl-text>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateCreateMilestoneComponent implements OnInit {
  @Input() event: NotificationCreateMilestone;
  amount: number;
  ngOnInit() {
    this.amount = toNumber(this.event.data.amount);
  }
}
