import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationAward } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-award',
  template: `
    <ng-container i18n="Notification template award">
      {{ event.data.username }} awarded you their project {{ event.data.title }}
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateAwardComponent {
  @Input() event: NotificationAward;
}
