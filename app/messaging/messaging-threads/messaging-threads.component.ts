import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Datastore, RequestStatus } from '@freelancer/datastore';
import {
  Contest,
  ContestsCollection,
  ThreadProject,
  ThreadProjectsCollection,
  ThreadsCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { Chat, MessagingChat } from '@freelancer/messaging-chat';
import { Margin } from '@freelancer/ui/margin';
import { assertNever, flatten, isDefined, toNumber } from '@freelancer/utils';
import {
  ContextTypeApi,
  FolderApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { threadToContextIds } from 'app/messaging/messaging-chat/helpers';
import * as Rx from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { DEFAULT_FILTER } from './messaging-threads-filters/messaging-threads-filters.component';
import {
  ThreadDetails,
  ThreadFilterOption,
  ThreadsLoadingStateType,
} from './messaging-threads.types';

@Component({
  selector: 'app-messaging-threads',
  template: `
    <ng-container *ngIf="!(isNav$ | async)">
      <ng-container
        *ngTemplateOutlet="
          actions;
          context: {
            loggedInUser: loggedInUser$ | async
          }
        "
      ></ng-container>
    </ng-container>
    <ng-template #actions let-loggedInUser="loggedInUser">
      <fl-bit class="MessagingThreads-actions">
        <fl-search
          class="MessagingThreads-actions-search"
          [flMarginRight]="Margin.XXSMALL"
          (query)="onSearch($event)"
          (submit)="onSubmitSearch(loggedInUser)"
        ></fl-search>
        <app-messaging-threads-filters
          [hasExistingThreads]="hasExistingThreads$ | async"
          (filterSelected)="onFilterSelected($event)"
        ></app-messaging-threads-filters>
      </fl-bit>
      <app-messaging-thread-recruiter-search
        *ngIf="loggedInUser?.supportStatus?.type"
        [searching]="(recruiterUserSearchQuery$ | async)?.length > 0"
        [status]="recruiterUserSearchResultFetchStatus$ | async"
        [users]="recruiterUserSearchResult$ | async"
        (startChat)="onStartChat($event)"
      ></app-messaging-thread-recruiter-search>
    </ng-template>
    <app-messaging-thread-list
      [hasExistingThreads$]="hasExistingThreads$"
      [hasMoreThreads$]="hasMoreThreads$"
      [isNav$]="isNav$"
      [isSearching$]="isSearching$"
      [threadsDetails$]="visibleThreadsDetails$"
      [threadsFetchStatus$]="threadsFetchStatus$"
      [threadsLoadingStateType$]="threadsLoadingStateType$"
      (loadMoreThreads)="onLoadMoreThreads()"
      (startChat)="onStartChat($event)"
    ></app-messaging-thread-list>
  `,
  styleUrls: ['./messaging-threads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadsComponent implements OnInit, OnDestroy {
  Margin = Margin;

  @Input() isNav$: Rx.Observable<boolean> = Rx.of(false);

  contests$: Rx.Observable<ReadonlyArray<Contest>>;
  hasExistingThreads$: Rx.Observable<boolean>;
  hasMoreThreads$: Rx.Observable<boolean>;
  isSearching$: Rx.Observable<boolean>;
  loggedInUser$: Rx.Observable<User>;
  projects$: Rx.Observable<ReadonlyArray<ThreadProject>>;
  recruiterUserSearchResult$: Rx.Observable<ReadonlyArray<User>>;
  recruiterUserSearchResultFetchStatus$: Rx.Observable<
    RequestStatus<UsersCollection>
  >;
  threadFilterSubscription?: Rx.Subscription;
  threadsFetchStatus$: Rx.Observable<RequestStatus<ThreadsCollection>>;
  threadsLimitSubject$: Rx.BehaviorSubject<number>;
  threadsLimit$: Rx.Observable<number>;
  threadsLoadingStateType$: Rx.Observable<ThreadsLoadingStateType>;
  visibleThreadsDetails$: Rx.Observable<ReadonlyArray<ThreadDetails>>;
  users$: Rx.Observable<ReadonlyArray<User>>;

  private threadFilterSubject$ = new Rx.BehaviorSubject<ThreadFilterOption>(
    DEFAULT_FILTER,
  );
  threadFilter$ = this.threadFilterSubject$.asObservable();

  private searchQuerySubject$ = new Rx.BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject$.asObservable();

  private recruiterUserSearchQuerySubject$ = new Rx.BehaviorSubject<string>('');
  recruiterUserSearchQuery$ = this.recruiterUserSearchQuerySubject$.asObservable();

  readonly THREADS_LIMIT_INCREMENT = 15;
  NON_ARCHIVE_FOLDERS: ReadonlyArray<FolderApi> = [
    FolderApi.INBOX,
    FolderApi.SENT,
    FolderApi.FREELANCER,
    FolderApi.NONE,
  ];

  constructor(
    private auth: Auth,
    private datastore: Datastore,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    const loggedInUserId$ = this.auth.getUserId().pipe(map(id => toNumber(id)));

    this.loggedInUser$ = this.datastore
      .document<UsersCollection>('users', loggedInUserId$)
      .valueChanges();

    this.threadsLimitSubject$ = new Rx.BehaviorSubject<number>(
      this.THREADS_LIMIT_INCREMENT,
    );
    this.threadsLimit$ = this.threadsLimitSubject$.asObservable();

    // We need to handle two types of loading states, one for the whole list (shown on page load
    // and filter change), and the other for load more functionality (a spinner). Since they both
    // rely on the same collection, we have a subject that holds the type of loading state to display.
    this.threadsLoadingStateType$ = Rx.merge(
      this.threadsLimit$.pipe(map(_ => ThreadsLoadingStateType.SPINNER)),
      this.threadFilter$.pipe(map(_ => ThreadsLoadingStateType.FULL_LIST)),
    );

    // We need a way to distinguish the two empty states, one is when the user has no
    // existing threads, and one if there are no threads that match the selected filter.
    // This one is used to check the first case.
    this.hasExistingThreads$ = this.datastore
      .collection<ThreadsCollection>('threads', query => query.limit(1))
      .valueChanges()
      .pipe(
        map(threads => threads.length > 0),
        startWith(true),
      );

    // To handle the 'Load More' CTA, we fetch `limit + 1` threads, but remove the last
    // one from the threads displayed. If the fetched threads is more than the limit, then
    // we display the Load More CTA.
    const threadsCollection = this.datastore.collection<ThreadsCollection>(
      'threads',
      query =>
        Rx.combineLatest([
          this.threadsLimit$,
          this.threadFilter$,
          this.isNav$,
        ]).pipe(
          map(([limit, threadFilter, isNav]) => {
            // If message list is in nav messages, only show 5 active threads
            if (isNav) {
              return query
                .where('folder', 'in', this.NON_ARCHIVE_FOLDERS)
                .limit(5);
            }

            let queryBuild = query.limit(limit + 1);

            switch (threadFilter) {
              case ThreadFilterOption.ACTIVE:
                queryBuild = queryBuild.where(
                  'folder',
                  'in',
                  this.NON_ARCHIVE_FOLDERS,
                );
                break;
              case ThreadFilterOption.UNREAD:
                queryBuild = queryBuild.where('isRead', '==', false);
                break;
              case ThreadFilterOption.SUPPORT:
                queryBuild = queryBuild
                  .where('folder', 'in', this.NON_ARCHIVE_FOLDERS)
                  .where('threadType', '==', ThreadTypeApi.ADMIN_PREFERRED_CHAT)
                  .where('contextType', '==', ContextTypeApi.SUPPORT_SESSION);
                break;
              case ThreadFilterOption.ARCHIVED:
                queryBuild = queryBuild.where(
                  'folder',
                  '==',
                  FolderApi.ARCHIVED,
                );
                break;
              default:
                assertNever(threadFilter);
            }

            return queryBuild;
          }),
        ),
    );
    this.threadsFetchStatus$ = threadsCollection.status$;
    const fetchedThreads$ = threadsCollection.valueChanges();

    this.hasMoreThreads$ = Rx.combineLatest([
      fetchedThreads$,
      this.threadsLimit$,
    ]).pipe(
      map(
        ([allFetchedThreads, threadsLimit]) =>
          threadsLimit < allFetchedThreads.length,
      ),
    );

    const threads$ = Rx.combineLatest([
      fetchedThreads$,
      this.hasMoreThreads$,
    ]).pipe(
      map(([threads, hasMoreThreads]) =>
        hasMoreThreads ? threads.slice(0, -1) : threads,
      ),
    );

    const userIds$ = threads$.pipe(
      map(threads => flatten(threads.map(thread => thread.members))),
    );

    const recruiterUserSearchResultCollection = this.datastore.collection<
      UsersCollection
    >('users', query =>
      query.limit(1).where(
        'username',
        'equalsIgnoreCase',
        this.recruiterUserSearchQuery$.pipe(
          map(searchQuery => searchQuery.trim()),
          filter(searchQuery => !!searchQuery),
        ),
      ),
    );

    this.recruiterUserSearchResult$ = recruiterUserSearchResultCollection
      .valueChanges()
      .pipe();

    this.recruiterUserSearchResultFetchStatus$ =
      recruiterUserSearchResultCollection.status$;

    this.users$ = this.datastore
      .collection<UsersCollection>('users', userIds$)
      .valueChanges();

    const projectIds$ = threads$.pipe(
      map(threads => threadToContextIds(threads, ContextTypeApi.PROJECT)),
    );

    this.projects$ = this.datastore
      .collection<ThreadProjectsCollection>('threadProjects', projectIds$)
      .valueChanges();

    const contestIds$ = threads$.pipe(
      map(threads => threadToContextIds(threads, ContextTypeApi.CONTEST)),
    );

    this.contests$ = this.datastore
      .collection<ContestsCollection>('contests', contestIds$)
      .valueChanges();

    // For each individual thread, we gather all the details into an object. This is NOT the
    // same as threadSets, which is a collection of threads (based on filter)
    // NOTE: If we decide to still have threadSets, might be better to move this to
    //       messaging-thread-list component
    const threadsDetails$ = Rx.combineLatest([
      threads$,
      this.users$,
      this.projects$,
      this.contests$,
    ]).pipe(
      map(([allThreads, users, projects, contests]) =>
        allThreads.map(thread => {
          let contextObject: Contest | ThreadProject | undefined;

          if (thread.context.type === ContextTypeApi.CONTEST) {
            const contextId = thread.context.id;
            contextObject = contests.find(contest => contest.id === contextId);
          } else if (thread.context.type === ContextTypeApi.PROJECT) {
            const contextId = thread.context.id;
            contextObject = projects.find(project => project.id === contextId);
          }

          return {
            thread,
            contextObject,
            members: thread.members
              .map(
                memberId =>
                  users.find(user => user.id === memberId) || undefined,
              )
              .filter(isDefined),
          };
        }),
      ),
    );

    // FIXME: Filtering/search should be done in the backend
    this.visibleThreadsDetails$ = Rx.combineLatest([
      loggedInUserId$,
      threadsDetails$,
      this.searchQuery$,
    ]).pipe(
      map(([loggedInUserId, threadDetails, searchQuery]) => {
        const query = searchQuery.toLowerCase();

        return threadDetails.filter(
          threadDetail =>
            threadDetail.contextObject?.title.toLowerCase().includes(query) ||
            threadDetail.members.some(
              member =>
                member.id !== loggedInUserId &&
                (member.displayName.toLowerCase().includes(query) ||
                  member.username.toLowerCase().includes(query)),
            ),
        );
      }),
    );

    this.isSearching$ = this.searchQuery$.pipe(
      map(searchQuery => !!searchQuery),
    );
  }

  onLoadMoreThreads() {
    this.threadsLimitSubject$.next(
      this.threadsLimitSubject$.value + this.THREADS_LIMIT_INCREMENT,
    );
  }

  onFilterSelected(threadFilter: ThreadFilterOption) {
    this.threadFilterSubject$.next(threadFilter);
  }

  onSearch(query: string) {
    this.searchQuerySubject$.next(query);
    this.recruiterUserSearchQuerySubject$.next('');
  }

  onStartChat(chat: Chat) {
    this.messagingChat.startChat(chat);
  }

  onSubmitSearch(loggedInUser: User) {
    if (!loggedInUser?.supportStatus?.type) {
      return;
    }

    this.recruiterUserSearchQuerySubject$.next(
      this.searchQuerySubject$.getValue(),
    );
  }

  trackByThreadId(index: number, threadItem: ThreadDetails): number {
    return threadItem.thread.id;
  }

  ngOnDestroy() {
    if (this.threadFilterSubscription) {
      this.threadFilterSubscription.unsubscribe();
    }
  }
}
