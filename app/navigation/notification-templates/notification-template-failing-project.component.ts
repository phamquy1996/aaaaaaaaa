import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationFailingProject } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-failing-project',
  template: `
    <ng-container i18n="Notification template failing project">
      <strong>{{ event.data.username }}</strong> posted
      <strong>{{ event.data.title }}</strong
      >.
      <ng-container
        *ngIf="event.data.maxBudget && event.data.currency !== 'TKN'"
      >
        Earn up to
        <fl-currency
          [code]="event.data.currency"
          [value]="event.data.maxBudget"
        ></fl-currency>
        <ng-container *ngIf="event.data.projIsHourly"> /hr </ng-container>
      </ng-container>
      {{ event.data.jobString }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateFailingProjectComponent {
  @Input() event: NotificationFailingProject;
}
