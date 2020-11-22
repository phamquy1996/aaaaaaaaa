import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Filter } from './filters.d';

@Component({
  selector: 'app-filter-switch',
  template: `
    <span
      class="FilterItem"
      [ngClass]="{ FilterActive: activeFilter === 'active' }"
      flTrackingLabel="ActiveThreads"
      flTrackingSection="ThreadListFilter"
      i18n="Contact list filter label"
      (click)="setFilter('active')"
    >
      Active
    </span>

    <span
      *ngIf="inboxMode"
      class="FilterItem"
      [ngClass]="{ FilterActive: activeFilter === 'unread' }"
      flTrackingLabel="UnreadThreads"
      flTrackingSection="ThreadListFilter"
      i18n="Contact list filter label"
      (click)="setFilter('unread')"
    >
      Unread ({{ unreadCount }})
    </span>

    <span
      *ngIf="inboxMode"
      class="FilterItem"
      [ngClass]="{ FilterActive: activeFilter === 'support' }"
      flTrackingLabel="SupportThreads"
      flTrackingSection="ThreadListFilter"
      i18n="Contact list filter label"
      (click)="setFilter('support')"
    >
      Support
    </span>

    <span
      class="FilterItem"
      [ngClass]="{ FilterActive: activeFilter === 'archived' }"
      flTrackingLabel="ArchivedThreads"
      flTrackingSection="ThreadListFilter"
      i18n="Contact list filter label"
      (click)="setFilter('archived')"
    >
      Archived
    </span>
  `,
  styleUrls: ['./filter-switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSwitchComponent {
  @Input() activeFilter: Filter;
  @Input() inboxMode: boolean;
  @Input() unreadCount: number;

  @Output() setActiveFilter = new EventEmitter<Filter>();

  setFilter(filter: Filter) {
    this.setActiveFilter.emit(filter);
  }
}
