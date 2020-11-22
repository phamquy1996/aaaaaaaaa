import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationShowcaseSourceApproval } from '@freelancer/datastore/collections';
import { LinkColor } from '@freelancer/ui/link';

@Component({
  selector: 'app-notification-template-showcase-source-approval',
  template: `
    <fl-text
      *ngIf="event.data.projectType === 'project'"
      i18n="
         Notification template to inform freelancer that the employer has
        approved their project to add to their portfolio
      "
    >
      Well done! You received a great review for your project
      <fl-link
        flTrackingLabel="CompletedHeaderUserLinkToApprovedProject"
        [link]="'/projects/' + event.data.projectId"
        [color]="LinkColor.INHERIT"
      >
        <strong>{{ event.data.projectTitle }}.</strong>
      </fl-link>
      Add it to your portfolio to improve your chances of getting hired.
    </fl-text>
    <fl-text
      *ngIf="event.data.projectType === 'contest'"
      i18n="
         Notification template to inform freelancer that the employer has
        approved their contest to add to their portfolio
      "
    >
      Well done! You received a great review for your contest
      <fl-link
        flTrackingLabel="CompletedHeaderUserLinkToApprovedProject"
        [link]="'/projects/' + event.data.projectId"
        [color]="LinkColor.INHERIT"
      >
        <strong>{{ event.data.projectTitle }}.</strong>
      </fl-link>
      Add it to your portfolio to improve your chances of getting hired.
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTemplateShowcaseSourceApprovalComponent {
  LinkColor = LinkColor;

  @Input() event: NotificationShowcaseSourceApproval;
}
