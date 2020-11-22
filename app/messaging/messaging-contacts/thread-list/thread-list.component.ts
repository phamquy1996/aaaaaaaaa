import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  Contest,
  OnlineOfflineUserStatus,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { ThreadSet } from './thread-set.component';

@Component({
  selector: 'app-thread-list',
  template: `
    <fl-spinner
      *ngIf="showLoadingSpinner"
      flTrackingLabel="MessagingThreadListInitialisationSpinner"
      [overlay]="true"
    ></fl-spinner>
    <perfect-scrollbar class="ThreadListContent" [config]="{}">
      <app-recruiter-chat-search-result
        [ngClass]="{ GrayBackground: grayBackground }"
        *ngIf="isRecruiter"
        [grayBackground]="grayBackground"
        [showSearchResults]="showRecruiterSearchResults"
        [searchUsernameString$]="recruiterUserSearchUsername$"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        (userSelected)="handleSearchUserSelected($event)"
        (threadSelected)="handleThreadSelected($event)"
      ></app-recruiter-chat-search-result>

      <ng-container *ngIf="projects && contests && users && threadSets">
        <app-thread-set
          *ngFor="let threadSet of threadSets; trackBy: identifyThreadSet"
          [grayBackground]="grayBackground"
          [contests]="contests"
          [projects]="projects"
          [threadSet]="threadSet"
          [users]="users"
          [onlineOfflineStatuses$]="onlineOfflineStatuses$"
          [selectedThreadId]="selectedThreadId"
          (selectThread)="handleThreadSelected($event)"
          flTrackingSection="contact-list-thread-set"
          data-uitest-target="contactlist-thread-item"
          [inboxMode]="inboxMode"
        ></app-thread-set>
      </ng-container>
      <fl-bit class="EmptyThreadSet" *ngIf="!setsHaveThreads">
        <fl-text [size]="TextSize.XXSMALL" i18n="Label for empty inbox">
          No messages yet.
        </fl-text>
      </fl-bit>
      <fl-bit class="ThreadsLoad">
        <fl-link
          *ngIf="!showLoadingMoreSpinner && canLoadMore && setsHaveThreads"
          i18n="Messaging load more link"
          flTrackingLabel="LoadMoreThreads"
          flTrackingSection="ThreadList"
          [flMarginBottom]="Margin.XXSMALL"
          (click)="handleLoadThreads()"
        >
          Load more...
        </fl-link>
        <fl-spinner
          *ngIf="showLoadingMoreSpinner"
          flTrackingLabel="MessagingThreadListLoadMoreSpinner"
          [size]="SpinnerSize.SMALL"
        ></fl-spinner>
      </fl-bit>
    </perfect-scrollbar>
  `,
  styleUrls: ['./thread-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadListComponent implements OnChanges {
  TextSize = TextSize;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  @HostBinding('class.IsCompact')
  @Input()
  isCompact: boolean;
  @Input() grayBackground = false;
  @Input() showLoadingSpinner = false;

  @Input() searchUser?: User;
  @Input() searchStatus?: string;
  @Input() threadSets: ReadonlyArray<ThreadSet>;
  @Input() users: { [key: number]: User };
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() projects: { [key: number]: ThreadProject };
  @Input() contests: { [key: number]: Contest };
  @Input() canLoadMore: boolean;
  @Input() showLoadingMoreSpinner = false;

  @Input() isRecruiter = false;
  @Input() showRecruiterSearchResults = false;
  @Input() recruiterUserSearchUsername$: Rx.Observable<string>;

  @Input() inboxMode: boolean;

  @Input() selectedThreadId?: number;

  @Output() searchUserSelected = new EventEmitter<User>();
  @Output() selectThread = new EventEmitter<Thread>();
  @Output() loadMoreThreads = new EventEmitter<boolean>();

  setsHaveThreads: boolean;

  ngOnChanges() {
    if (this.threadSets) {
      this.setsHaveThreads = !!this.threadSets.find(
        threadSet => threadSet.threads.length > 0,
      );
    }
  }

  handleThreadSelected(thread: Thread) {
    this.selectThread.emit(thread);
  }

  identifyThreadSet(threadSet: ThreadSet) {
    return threadSet.title;
  }

  handleLoadThreads() {
    this.loadMoreThreads.emit();
  }

  handleSearchUserSelected(user: User) {
    this.searchUserSelected.emit(user);
  }
}
