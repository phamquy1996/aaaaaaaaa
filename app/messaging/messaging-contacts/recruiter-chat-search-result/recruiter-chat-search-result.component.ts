import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  OnlineOfflineUserStatus,
  Thread,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import * as Rx from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  tap,
} from 'rxjs/operators';
import { ThreadSet, ThreadSetIndex } from '../thread-list/thread-set.component';

@Component({
  selector: 'app-recruiter-chat-search-result',
  template: `
    <app-user-search-result
      flTrackingSection="MessagingRecruiterUserSearch"
      [ngClass]="{ GrayBackground: grayBackground }"
      [searchUser]="searchUser$ | async"
      [searchStatus]="searchStatus"
      [showSearchResults]="showSearchResults && (userFound$ | async)"
      (userSelected)="handleSearchUserSelected($event)"
    ></app-user-search-result>

    <app-thread-set
      *ngIf="
        showSearchResults &&
        (userFound$ | async) &&
        (candidateUserThreadSearch$ | async)?.threads.length > 0
      "
      [threadSet]="candidateUserThreadSearch$ | async"
      [users]="users$ | async"
      [grayBackground]="grayBackground"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      (selectThread)="handleThreadSelected($event)"
    ></app-thread-set>
  `,
  styleUrls: ['./recruiter-chat-search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecruiterChatSearchResultComponent implements OnInit {
  @Input() searchUsernameString$: Rx.Observable<string>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  @Input() showSearchResults = false;
  @Input() grayBackground = true;

  @Output() userSelected = new EventEmitter<User>();
  @Output() threadSelected = new EventEmitter<Thread>();

  users$: Rx.Observable<{ [key: number]: User }>;

  candidateUserThreadSearch$: Rx.Observable<ThreadSet>;
  searchUser$: Rx.Observable<User>;
  userFound$: Rx.Observable<boolean>;
  searchStatus: 'idle' | 'searching' | 'error' | 'empty' = 'idle';

  constructor(private datastore: Datastore) {}

  ngOnInit() {
    const candidateUserSearch$ = this.datastore
      .collection<UsersCollection>('users', query =>
        query.limit(1).where(
          'username',
          'equalsIgnoreCase',
          this.searchUsernameString$.pipe(
            tap(() => {
              this.searchStatus = 'searching';
            }),
          ),
        ),
      )
      .valueChanges()
      .pipe(
        catchError((err, caught$) => {
          this.searchStatus = 'error';
          return caught$;
        }),
        publishReplay(1),
        refCount(),
      );

    this.userFound$ = candidateUserSearch$.pipe(
      tap(users => {
        if (users.length > 0) {
          this.searchStatus = 'idle';
        } else {
          this.searchStatus = 'empty';
        }
      }),
      map(users => users.length > 0),
      distinctUntilChanged(),
      startWith(false),
    );

    this.searchUser$ = candidateUserSearch$.pipe(
      filter(users => users.length === 1),
      map(([user]) => user),
    );

    this.candidateUserThreadSearch$ = Rx.of([] as Thread[]).pipe(
      map(threads => ({
        title: 'Support Session Chats',
        threads,
        index: ThreadSetIndex.SUPPORT,
      })),
    );

    this.users$ = this.datastore
      .collection<UsersCollection>(
        'users',
        this.candidateUserThreadSearch$.pipe(
          map(threadSet =>
            threadSet.threads
              .map(t => t.members)
              .reduce((acc, arr) => [...acc, ...arr], []),
          ),
        ),
      )
      .valueChanges()
      .pipe(
        map(users => {
          const userDict: { [key: number]: User } = {};
          users.forEach(u => (userDict[u.id] = u));
          return userDict;
        }),
      );
  }

  handleSearchUserSelected(user: User) {
    this.userSelected.emit(user);
  }

  handleThreadSelected(thread: Thread) {
    this.threadSelected.emit(thread);
  }
}
