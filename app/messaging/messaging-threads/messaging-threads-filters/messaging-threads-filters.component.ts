import {
  // AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor } from '@freelancer/ui/icon';
import { ListItemType } from '@freelancer/ui/list-item';
import * as Rx from 'rxjs';
import { ThreadFilterOption } from '../messaging-threads.types';

export const DEFAULT_FILTER = ThreadFilterOption.ACTIVE;

@Component({
  selector: 'app-messaging-threads-filters',
  template: `
    <fl-dropdown-filter
      flTrackingSection="InboxWidgetThreadFilters"
      buttonText="Filter"
      buttonTextApplied="{{ filterControl.value }}"
      [autoClose]="true"
      [edgeToEdge]="true"
      [filterApplied]="true"
      [hideDropdownIcon]="true"
      [iconLabel]="'ui-setting-filter-v2'"
      [disabled]="!hasExistingThreads"
    >
      <fl-list [clickable]="true" [type]="ListItemType.NON_BORDERED">
        <fl-list-item
          flTrackingLabel="InboxWidgetActiveFilter"
          [control]="filterControl"
          [radioValue]="ThreadFilterOption.ACTIVE"
        >
          <fl-text i18n="Active filter title">
            Active
          </fl-text>
        </fl-list-item>
        <fl-list-item
          flTrackingLabel="InboxWidgetUnreadFilter"
          [control]="filterControl"
          [radioValue]="ThreadFilterOption.UNREAD"
        >
          <fl-text i18n="Unread filter title">
            Unread
          </fl-text>
        </fl-list-item>
        <fl-list-item
          flTrackingLabel="InboxWidgetSupportFilter"
          [control]="filterControl"
          [radioValue]="ThreadFilterOption.SUPPORT"
        >
          <fl-text i18n="Support filter title">
            Support
          </fl-text>
        </fl-list-item>
        <fl-list-item
          flTrackingLabel="InboxWidgetArchivedFilter"
          [control]="filterControl"
          [radioValue]="ThreadFilterOption.ARCHIVED"
        >
          <fl-text i18n="Archived filter title">
            Archived
          </fl-text>
        </fl-list-item>
      </fl-list>
    </fl-dropdown-filter>
  `,
  styleUrls: ['./messaging-threads-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadsFiltersComponent implements OnInit, OnDestroy {
  IconColor = IconColor;
  ListItemType = ListItemType;
  ThreadFilterOption = ThreadFilterOption;

  @Input() hasExistingThreads: boolean;
  @Output() filterSelected = new EventEmitter<ThreadFilterOption>();

  filterControl: FormControl;
  filterControlSubscription?: Rx.Subscription;

  ngOnInit() {
    this.filterControl = new FormControl(DEFAULT_FILTER);
    this.filterControlSubscription = this.filterControl.valueChanges.subscribe(
      filter => this.filterSelected.emit(filter),
    );
  }

  ngOnDestroy() {
    if (this.filterControlSubscription) {
      this.filterControlSubscription.unsubscribe();
    }
  }
}
