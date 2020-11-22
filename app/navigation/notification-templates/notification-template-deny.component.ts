import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationDenied } from '@freelancer/datastore/collections';

@Component({
  selector: 'app-notification-template-deny',
  template: `
    <ng-container i18n="Notification template deny">
      Unfortunately, {{ event.data.publicName || event.data.username }} has
      declined your offer for {{ event.data.name }}. Find another suitable
      freelancer and award them to start your project.
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateDenyComponent {
  @Input() event: NotificationDenied;
}
