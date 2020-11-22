import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  NotificationHireMe,
  NotificationQuickHireProject,
} from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-quick-hire-project',
  template: `
    <ng-container i18n="Notification template quick hire project">
      <strong>{{ event.data.publicName || event.data.username }}</strong> hired
      you for their project <strong>{{ event.data.title }}</strong>
    </ng-container>
    <ng-container
      *ngIf="
        event.data.period &&
        event.data.sum &&
        event.data.currency &&
        event.data.projIsHourly &&
        event.data.currency.code !== 'TKN'
      "
      i18n="Notification template quick hire project"
    >
      <strong>
        for
        <fl-currency
          [code]="event.data.currency.code"
          [value]="event.data.sum"
        ></fl-currency>
        <ng-container *ngIf="event.data.projIsHourly"
          >/hr ({{ event.data.period }} hrs/week)</ng-container
        >
        <ng-container *ngIf="!event.data.projIsHourly"
          >to complete in {{ event.data.period }} days</ng-container
        >
      </strong>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateQuickHireProjectComponent {
  @Input() event: NotificationQuickHireProject | NotificationHireMe;
}
