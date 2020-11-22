import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationDraftContest } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-draft-contest',
  template: `
    <ng-container i18n="Notification template draft contest">
      Your contest <strong>{{ event.data.contestName }}</strong> is almost ready
      to go live! Post it now!
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateDraftContestComponent {
  @Input() event: NotificationDraftContest;
}
