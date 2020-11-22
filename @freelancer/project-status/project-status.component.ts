import { Component, HostBinding, Input } from '@angular/core';
import { TagStatusColor } from '@freelancer/ui/tag-status';
import { ProjectStatus, ProjectStatusFromBids } from './project-status.model';

@Component({
  selector: 'fl-project-status',
  template: `
    <fl-tag-status
      *ngIf="styled; else unStyled"
      [color]="
        status === 'open' ? TagStatusColor.GREEN : TagStatusColor.DEFAULT
      "
    >
      <ng-container *ngTemplateOutlet="statusText"></ng-container>
    </fl-tag-status>

    <ng-template #unStyled>
      <ng-container *ngTemplateOutlet="statusText"></ng-container>
    </ng-template>

    <ng-template #statusText>
      <ng-container [ngSwitch]="status">
        <ng-container *ngSwitchCase="'open'" i18n="Project status label">
          Open
        </ng-container>
        <ng-container
          *ngSwitchCase="'work_in_progress'"
          i18n="Project status label"
        >
          In Progress
        </ng-container>
        <ng-container *ngSwitchCase="'accepted'" i18n="Project status label">
          Accepted
        </ng-container>
        <ng-container
          *ngSwitchCase="'awaiting_acceptance'"
          i18n="Project status label"
        >
          Awaiting Acceptance
        </ng-container>
        <ng-container *ngSwitchCase="'closed'" i18n="Project status label">
          Closed
        </ng-container>
        <ng-container *ngSwitchCase="'canceled'" i18n="Project status label">
          Canceled
        </ng-container>
        <ng-container *ngSwitchCase="'complete'" i18n="Project status label">
          Complete
        </ng-container>
        <ng-container *ngSwitchCase="'incomplete'" i18n="Project status label">
          Incomplete
        </ng-container>
        <ng-container *ngSwitchCase="'pending'" i18n="Project status label">
          Pending
        </ng-container>
        <ng-container *ngSwitchCase="'draft'" i18n="Project status label">
          Draft
        </ng-container>
        <ng-container *ngSwitchCase="'expired'" i18n="Project status label">
          Expired
        </ng-container>
        <ng-container *ngSwitchCase="'rejected'" i18n="Project status label">
          Rejected
        </ng-container>
        <ng-container *ngSwitchCase="'revoked'" i18n="Project status label">
          Revoked
        </ng-container>
        <ng-container
          *ngSwitchCase="'no_freelancer_selected'"
          i18n="Project status label"
        >
          No Freelancer Selected
        </ng-container>
      </ng-container>
    </ng-template>
  `,
  styleUrls: ['./project-status.component.scss'],
})
export class ProjectStatusComponent {
  TagStatusColor = TagStatusColor;

  @Input() styled = true;

  @HostBinding('attr.data-status')
  @Input()
  status: ProjectStatus | ProjectStatusFromBids;
}
