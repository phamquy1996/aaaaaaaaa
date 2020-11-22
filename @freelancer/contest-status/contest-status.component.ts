import { Component, HostBinding, Input } from '@angular/core';
import { TagStatusColor } from '@freelancer/ui/tag-status';
import { FontWeight, TextSize } from '@freelancer/ui/text';
import { ContestStatusApi } from 'api-typings/contests/contests';

@Component({
  selector: 'fl-contest-status',
  template: `
    <fl-tag-status
      *ngIf="styled; else unStyled"
      [color]="
        status === 'active' ? TagStatusColor.GREEN : TagStatusColor.DEFAULT
      "
    >
      <ng-container *ngTemplateOutlet="statusText"></ng-container>
    </fl-tag-status>

    <ng-template #unStyled>
      <ng-container *ngTemplateOutlet="statusText"></ng-container>
    </ng-template>

    <ng-template #statusText>
      <ng-container [ngSwitch]="status">
        <ng-container *ngSwitchCase="'inactive'" i18n="Contest status label">
          Draft
        </ng-container>
        <ng-container *ngSwitchCase="'active'" i18n="Contest status label">
          Open
        </ng-container>
        <ng-container *ngSwitchCase="'pending'" i18n="Contest status label">
          Pending
        </ng-container>
        <ng-container *ngSwitchCase="'closed'" i18n="Contest status label">
          Closed
        </ng-container>
        <ng-container
          *ngSwitchCase="'active_not_expired'"
          i18n="Contest status label"
        >
          Open
        </ng-container>
      </ng-container>
    </ng-template>
  `,
  styleUrls: ['./contest-status.component.scss'],
})
export class ContestStatusComponent {
  TextSize = TextSize;
  FontWeight = FontWeight;
  TagStatusColor = TagStatusColor;

  @Input() styled = true;

  @HostBinding('attr.data-status')
  @Input()
  status: ContestStatusApi;
}
