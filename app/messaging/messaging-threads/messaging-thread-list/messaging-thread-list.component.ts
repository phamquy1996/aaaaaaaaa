import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RequestStatus } from '@freelancer/datastore';
import { ThreadsCollection } from '@freelancer/datastore/collections';
import { Chat } from '@freelancer/messaging-chat';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontType, FontWeight, TextAlign, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import {
  ThreadDetails,
  ThreadsLoadingStateType,
} from '../messaging-threads.types';

@Component({
  selector: 'app-messaging-thread-list',
  template: `
    <ng-container
      *ngIf="threadsFetchStatus$ | async as fetchStatus"
      flTrackingSection="MessagingThreadList"
    >
      <fl-bit
        [ngClass]="{ LoadingMessagingThreadList: !(isNav$ | async) }"
        *ngIf="
          (!(threadsDetails$ | async) || !fetchStatus.ready) &&
            (threadsLoadingStateType$ | async) ===
              ThreadsLoadingStateType.FULL_LIST;
          else loadedState
        "
      >
        <fl-bit
          *ngIf="fetchStatus.error as error; else loadingState"
          class="LoadingMessagingThreadList-errorState"
          [flMarginBottom]="Margin.XXSMALL"
        >
          <ng-container
            *ngTemplateOutlet="
              errorState;
              context: {
                iconMarginBottom: Margin.XXSMALL,
                iconMarginRight: Margin.NONE,
                iconSize: IconSize.XXLARGE,
                textSize: TextSize.SMALL,
                error: error
              }
            "
          ></ng-container>
        </fl-bit>
        <!-- Loading state -->
        <ng-template #loadingState>
          <fl-list [type]="ListItemType.NON_BORDERED">
            <fl-list-item *flRepeat="5" [flMarginBottom]="Margin.XSMALL">
              <fl-bit class="LoadingMessagingThreadList-item">
                <fl-user-avatar
                  [flMarginRight]="Margin.XSMALL"
                  [users]="[undefined]"
                ></fl-user-avatar>
                <fl-loading-text [rows]="2" [padded]="false"></fl-loading-text>
              </fl-bit>
            </fl-list-item>
          </fl-list>
        </ng-template>
      </fl-bit>

      <ng-template #loadedState>
        <perfect-scrollbar
          *ngIf="(threadsDetails$ | async)?.length > 0; else emptyState"
          [ngClass]="{ MessagingThreadList: !(isNav$ | async) }"
        >
          <fl-list
            [clickable]="true"
            [type]="ListItemType.NON_BORDERED"
            [flMarginBottom]="Margin.SMALL"
          >
            <fl-list-item
              *ngFor="
                let threadDetails of threadsDetails$ | async;
                trackBy: trackByThreadId
              "
              flTrackingLabel="MessagingThreadListItem"
              [clickable]="true"
              (click)="onListItemClick($event, threadDetails)"
            >
              <app-messaging-thread-list-item
                [threadDetails]="threadDetails"
              ></app-messaging-thread-list-item>
            </fl-list-item>
          </fl-list>
          <fl-bit class="MessagingThreadList-loadMore">
            <fl-bit
              *ngIf="fetchStatus.error as error"
              class="MessagingThreadList-loadMore-error"
              [flMarginBottom]="Margin.SMALL"
            >
              <ng-container
                *ngTemplateOutlet="
                  errorState;
                  context: {
                    iconMarginBottom: Margin.NONE,
                    iconMarginRight: Margin.XXSMALL,
                    iconSize: IconSize.MID,
                    textSize: TextSize.XSMALL,
                    error: error
                  }
                "
              ></ng-container>
            </fl-bit>
            <fl-spinner
              *ngIf="!fetchStatus.ready && !fetchStatus.error"
              flTrackingLabel="LoadingMoreThreadsSpinner"
              [size]="SpinnerSize.SMALL"
              [flMarginBottom]="Margin.SMALL"
            ></fl-spinner>
            <fl-link
              *ngIf="
                fetchStatus.ready &&
                !fetchStatus.error &&
                (hasMoreThreads$ | async)
              "
              flTrackingLabel="LoadMoreThreadsLink"
              i18n="Load more threads link text"
              [flMarginBottom]="Margin.SMALL"
              (click)="loadMoreThreads.emit()"
            >
              Load more
            </fl-link>
          </fl-bit>
        </perfect-scrollbar>

        <!-- Empty state -->
        <ng-template #emptyState>
          <app-messaging-thread-list-empty-state
            [hasExistingThreads$]="hasExistingThreads$"
            [isSearching$]="isSearching$"
            [isNav$]="isNav$"
          ></app-messaging-thread-list-empty-state>
        </ng-template>
      </ng-template>

      <!-- Error State -->
      <ng-template
        #errorState
        let-iconMarginBottom="iconMarginBottom"
        let-iconMarginRight="iconMarginRight"
        let-iconSize="iconSize"
        let-textSize="textSize"
        let-error="error"
      >
        <fl-icon
          [name]="'ui-warning-alt-v2'"
          [color]="IconColor.CONTEST"
          [size]="iconSize"
          [flMarginBottom]="iconMarginBottom"
          [flMarginRight]="iconMarginRight"
        ></fl-icon>
        <fl-bit>
          <fl-text
            i18n="Messages error state description"
            [size]="textSize"
            [textAlign]="TextAlign.CENTER"
          >
            Oops, something went wrong.
          </fl-text>
          <fl-text
            i18n="Refresh inbox widget text"
            [size]="textSize"
            [textAlign]="TextAlign.CENTER"
          >
            Please
            <fl-link
              flTrackingLabel="RefreshInboxWidget"
              [size]="TextSize.INHERIT"
              (click)="error.retry()"
              >refresh</fl-link
            >
            and try again.
          </fl-text>
        </fl-bit>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./messaging-thread-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadListComponent {
  FontType = FontType;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  IconSize = IconSize;
  ListItemType = ListItemType;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextAlign = TextAlign;
  TextSize = TextSize;
  ThreadsLoadingStateType = ThreadsLoadingStateType;

  @Input() hasExistingThreads$: Rx.Observable<boolean>;
  @Input() hasMoreThreads$: Rx.Observable<boolean>;
  @Input() isNav$: Rx.Observable<boolean> = Rx.of(false);
  @Input() isSearching$: Rx.Observable<boolean>;
  @Input() threadsDetails$: Rx.Observable<ReadonlyArray<ThreadDetails>>;
  @Input() threadsFetchStatus$: Rx.Observable<RequestStatus<ThreadsCollection>>;
  @Input() threadsLoadingStateType$: Rx.Observable<ThreadsLoadingStateType>;
  @Output() loadMoreThreads = new EventEmitter<void>();
  @Output() startChat = new EventEmitter<Chat>();

  trackByThreadId(index: number, threadItem: ThreadDetails): number {
    return threadItem.thread.id;
  }

  onListItemClick(event: MouseEvent, threadDetails: ThreadDetails) {
    // Prevents link from redirecting to inbox page
    event.preventDefault();

    this.startChat.emit({
      userIds: threadDetails.thread.members,
      threadType: threadDetails.thread.threadType,
      origin: '',
      context: threadDetails.thread.context,
      threadId: threadDetails.thread.id,
      focus: true,
    });
  }
}
