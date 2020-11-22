import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NotificationReleaseMilestone } from '@freelancer/datastore/collections';
import { toNumber } from '@freelancer/utils';

@Component({
  selector: 'app-notification-template-release-milestone',
  template: `
    <ng-container
      *ngIf="event.data.currencyCode !== 'TKN'; else tokenText"
      i18n="Notification template release milestone"
    >
      <strong>{{ event.data.publicName || event.data.username }}</strong>
      released a
      <fl-currency [code]="event.data.currencyCode" [value]="event.data.amount">
      </fl-currency>
      milestone payment for project <strong>{{ event.data.title }}</strong
      >.
    </ng-container>
    <ng-template #tokenText>
      <ng-container i18n="Notification template release milestone">
        <strong>{{ event.data.publicName || event.data.username }}</strong>
        released a milestone of
        {{ amount | flCurrency: event.data.currencyCode }} for project
        <strong>{{ event.data.title }}</strong
        >.
      </ng-container>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateReleaseMilestoneComponent implements OnInit {
  @Input() event: NotificationReleaseMilestone;
  amount: number;
  ngOnInit() {
    this.amount = toNumber(this.event.data.amount);
  }
}
