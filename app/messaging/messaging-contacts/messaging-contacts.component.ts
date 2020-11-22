import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, PRIMARY_OUTLET, Router } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  asObject,
  combineLatestExtended,
  Datastore,
  startWithEmptyList,
  uniqWith,
  WebSocketService,
} from '@freelancer/datastore';
import {
  Contest,
  ContestsCollection,
  isNotificationEntry,
  NotificationEntry,
  NotificationsCollection,
  NotificationsPreferenceEntry,
  NotificationsPreferencesCollection,
  OnlineOfflineCollection,
  OnlineOfflineUserStatus,
  ProjectFeedCollection,
  ProjectFeedFailingContestsCollection,
  ProjectFeedFailingProjectsCollection,
  SearchThreadsCollection,
  Team,
  TeamsCollection,
  Thread,
  ThreadProject,
  ThreadProjectsCollection,
  ThreadsCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { InboxViewState, MessagingChat } from '@freelancer/messaging-chat';
import { TimeUtils } from '@freelancer/time-utils';
import { ModalService } from '@freelancer/ui';
import { ModalSize } from '@freelancer/ui/modal';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { assertNever, isDefined, toNumber } from '@freelancer/utils';
import { CallType, Videochat } from '@freelancer/videochat';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import {
  isSupportUser,
  threadToContextIds,
} from 'app/messaging/messaging-chat/helpers';
import { MESSAGING_THREADS_DEFAULT_LIMIT } from 'app/messaging/messaging.component';
import * as Rx from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  publishReplay,
  refCount,
  startWith,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CallAlertModalComponent } from '../messaging-chat/call-alert-modal/call-alert-modal.component';
import {} from '../messaging-chat/chat-box/chat-box.component';
import {
  CallEvent,
  websocketListener,
} from '../messaging-chat/websocket-listener';
import { Filter } from './filter-switch/filters.d';
import { SearchMode } from './search/search.component';
import {
  ThreadSet,
  ThreadSetIndex,
  ThreadSetKey,
} from './thread-list/thread-set.component';

interface UserDict {
  [key: number]: User;
}

@Component({
  selector: 'app-messaging-contacts',
  template: `
    <app-header
      *ngIf="!inboxMode"
      (minimise)="toggleMinimise()"
      (setChatSoundSetting)="setChatSoundSetting($event)"
      [soundSetting]="chatSoundSetting$ | async"
      [isMinimised]="isMinimised && isCompact"
      [isCompact]="isCompact"
      [unreadCount]="unreadCount$ | async"
    ></app-header>
    <app-ticker
      *ngIf="
        !isHidden && !inboxMode && isCompact === false && (tickerItem$ | async)
      "
      class="Ticker"
      [items]="tickerItem$ | async"
    >
    </app-ticker>
    <fl-bit [flShowMobile]="true">
      <fl-bit [flSticky]="true">
        <ng-container *ngTemplateOutlet="searchFilter"></ng-container>
      </fl-bit>
    </fl-bit>
    <fl-bit [flHideMobile]="true">
      <ng-container *ngTemplateOutlet="searchFilter"></ng-container>
    </fl-bit>
    <ng-template #searchFilter>
      <app-search
        *ngIf="inboxMode"
        class="SearchBar"
        flTrackingSection="contact-list-search"
        [threadSearchEnabled]="inboxMode"
        [inputControl]="searchFormControl"
        [searchMode]="threadSearchMode$ | async"
        [showThreadSearchOption]="showThreadSearchOption$ | async"
        (threadSearchSelected)="handleThreadSearchSelected()"
      ></app-search>
      <app-filter-switch
        [ngClass]="{ InboxList: inboxMode }"
        *ngIf="showFilterSwitch$ | async"
        class="FilterSwitch"
        [inboxMode]="inboxMode"
        [unreadCount]="unreadCount$ | async"
        [activeFilter]="activeFilter$ | async"
        (setActiveFilter)="handleFilterSwitched($event)"
        data-uitest-target="contactlist-filter-switch"
      ></app-filter-switch>
    </ng-template>
    <app-thread-list
      [ngClass]="{ InboxList: inboxMode }"
      *ngIf="(showEmptySearchResult$ | async) === false"
      class="ThreadList"
      [isRecruiter]="isRecruiter()"
      [showLoadingSpinner]="showThreadListSpinner$ | async"
      [showLoadingMoreSpinner]="showLoadingMoreSpinner"
      [isCompact]="isCompact"
      [grayBackground]="!inboxMode && !isCompact"
      [threadSets]="threadSets$ | async"
      [users]="users$ | async"
      [projects]="projects$ | async"
      [contests]="contests$ | async"
      [onlineOfflineStatuses$]="onlineOfflineStatuses$"
      [recruiterUserSearchUsername$]="recruiterUserSearchUsername$"
      [showRecruiterSearchResults]="recruiterSearchModeActive$ | async"
      [canLoadMore]="canLoadMore$ | async"
      [selectedThreadId]="selectedThreadId"
      [inboxMode]="inboxMode"
      (selectThread)="handleThreadSelected($event)"
      (searchUserSelected)="handleSearchUserSelected($event)"
      (loadMoreThreads)="handleLoadThreads()"
    ></app-thread-list>

    <fl-bit class="SearchEmpty" *ngIf="showEmptySearchResult$ | async">
      <fl-picture
        alt="No messages found"
        i18n-alt="Messaging contact list empty alt text"
        [src]="'messaging/magnifying-glass.svg'"
      ></fl-picture>
      <fl-text
        i18n="Messaging search result"
        [size]="TextSize.SMALL"
        [color]="FontColor.MID"
      >
        No conversations matched your search
      </fl-text>
    </fl-bit>

    <app-search
      *ngIf="!inboxMode"
      class="SearchBar"
      flTrackingSection="contact-list-search"
      [threadSearchEnabled]="inboxMode"
      [inputControl]="searchFormControl"
      (keyEnter)="handleSearchKeyEnter()"
    ></app-search>
  `,
  styleUrls: ['./messaging-contacts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingContactsComponent implements OnInit, OnDestroy {
  FontColor = FontColor;
  TextSize = TextSize;
  @Input() currentUser: User;
  @Input() inCall$: Rx.Observable<boolean>;

  @HostBinding('class.IsInbox')
  @Input()
  inboxMode = false;

  @Output() makingCall = new EventEmitter<boolean>();
  @Output() minimise = new EventEmitter<boolean>();

  @HostBinding('class.IsCompact')
  @Input()
  isCompact = false;

  @HostBinding('class.IsMinimised')
  @Input()
  isMinimised = false;

  @HostBinding('class.IsHidden') isHidden = !this.inboxMode;

  @Input() selectedThreadId?: number;

  userId$ = this.auth.getUserId();
  private activeFilterSubject$ = new Rx.BehaviorSubject<Filter>('active');
  activeFilter$: Rx.Observable<Filter>;
  searchText$: Rx.Observable<string>;
  threads$: Rx.Observable<ReadonlyArray<Thread>>;
  // This spinner is to represent when threads are being loaded during the initial load
  showThreadListSpinner$: Rx.Observable<boolean>;
  sortedThreads$: Rx.Observable<ReadonlyArray<Thread>>;
  searchThreads$: Rx.Observable<ReadonlyArray<Thread>>;
  unreadThreads$: Rx.Observable<ReadonlyArray<Thread>>;
  allThreads$: Rx.Observable<ReadonlyArray<Thread>>;
  threadSets$: Rx.Observable<ReadonlyArray<ThreadSet>>;
  users$: Rx.Observable<{ [key: number]: User }>;
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  projects$: Rx.Observable<{ [key: number]: ThreadProject }>;
  contests$: Rx.Observable<{ [key: number]: Contest }>;
  teams$: Rx.Observable<{ [key: number]: Team }>;
  searchFormControl = new FormControl();
  showFilterSwitch$: Rx.Observable<boolean>;
  showEmptySearchResult$: Rx.Observable<boolean>;
  threadSearchMode$: Rx.Observable<SearchMode>;
  recruiterUserSearchUsername$: Rx.Observable<string>;
  resetRecruiterSearch$: Rx.Observable<boolean>; // should remove this
  recruiterSearchModeActive$: Rx.Observable<boolean>;
  private threadSearchSelectedSubject$ = new Rx.BehaviorSubject<boolean>(false);
  threadSearchSelected$ = this.threadSearchSelectedSubject$
    .asObservable()
    .pipe(publishReplay(1), refCount());
  private searchKeyEnterSubject$ = new Rx.Subject<boolean>();
  searchKeyEnter$ = this.searchKeyEnterSubject$
    .asObservable()
    .pipe(publishReplay(1), refCount());
  showThreadSearchOption$: Rx.Observable<boolean>;
  searchStatus: 'idle' | 'searching' | 'error' | 'empty' = 'idle';
  unreadCount$: Rx.Observable<number>;
  autoOpenedThreads: { [key: number]: boolean } = {};

  // Properties for the load more logic
  readonly defaultThreadLimit = MESSAGING_THREADS_DEFAULT_LIMIT;
  readonly limitIncreaseStep = 100;
  readonly maxLimit = 5000;
  currentThreadsLimit = this.defaultThreadLimit;
  currentUnreadThreadsLimit = this.defaultThreadLimit;
  private threadsLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.currentThreadsLimit,
  );
  private unreadThreadsLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.currentUnreadThreadsLimit,
  );
  canLoadMore$: Rx.Observable<boolean>;
  // This spinner is just to toggle the loading spinner when the user clicks "load more...",
  // i.e. to load additional threads to the default list already loaded.
  showLoadingMoreSpinner = false;

  private threadSubscription?: Rx.Subscription; // hide contact list without threads
  private callAlertSubscription?: Rx.Subscription; // handle call alert modal
  private emptyThreadNavigateSubscription?: Rx.Subscription; // default thread in inbox
  private startChatSubscription?: Rx.Subscription;

  notificationSettingsCollection = this.datastore.collection<
    NotificationsPreferencesCollection
  >('notificationsPreferences');

  notifications$ = Rx.combineLatest([
    this.datastore
      .collection<NotificationsCollection>('notifications', query =>
        query.limit(100),
      )
      .valueChanges()
      .pipe(map(notifications => notifications.filter(isNotificationEntry))),
    this.userId$,
  ]).pipe(
    map(([notifications, currentUserId]) =>
      notifications.filter(
        (n: NotificationEntry) =>
          // don't show notifications caused by self
          !(
            'userId' in n.data &&
            toNumber(n.data.userId) === toNumber(currentUserId)
          ),
      ),
    ),
    map(notifications =>
      notifications.map(notif => ({
        entry: notif,
        tag: 'notification',
        time: notif.time,
      })),
    ),
  );

  jobIdsToNotify$ = this.notificationSettingsCollection.valueChanges().pipe(
    map(notificationSettings =>
      notificationSettings
        .filter(
          notificationSetting =>
            notificationSetting.enabled &&
            notificationSetting.channel.startsWith('job_') &&
            notificationSetting.notificationType === 'live',
        )
        .map(notificationSetting => {
          const settingChannelSplitArray = notificationSetting.channel.split(
            '_',
          );
          if (settingChannelSplitArray.length >= 2) {
            return toNumber(settingChannelSplitArray[1]);
          }

          return undefined;
        })
        .filter(isDefined),
    ),
  );

  failingProjectsCollection = this.datastore.collection<
    ProjectFeedFailingProjectsCollection
  >('projectFeedFailingProjects', query =>
    query.where('jobIds', 'intersects', this.jobIdsToNotify$).limit(100),
  );

  failingContestsCollection = this.datastore.collection<
    ProjectFeedFailingContestsCollection
  >('projectFeedFailingContests', query =>
    query.where('jobIds', 'intersects', this.jobIdsToNotify$).limit(100),
  );

  projectFeed$ = Rx.combineLatest([
    this.datastore
      .collection<ProjectFeedCollection>('projectFeed', query =>
        query.where('jobIds', 'intersects', this.jobIdsToNotify$).limit(100),
      )
      .valueChanges(),
    this.failingProjectsCollection.valueChanges(),
    this.failingContestsCollection.valueChanges(),
  ]).pipe(
    map(([projectFeed, failingProjects, failingContests]) =>
      [...projectFeed, ...failingProjects, ...failingContests].map(entry => ({
        entry,
        tag: 'project',
        time: entry.time,
      })),
    ),
  );

  tickerItem$ = Rx.combineLatest([this.notifications$, this.projectFeed$]).pipe(
    map(([notifications, projects]) =>
      [...notifications, ...projects]
        .sort((a, b) => a.time - b.time)
        .slice(-100),
    ),
    publishReplay(1),
    refCount(),
  );

  chatSoundSetting$: Rx.Observable<
    NotificationsPreferenceEntry | undefined
  > = this.notificationSettingsCollection.valueChanges().pipe(
    map(preferences => {
      const settings = preferences.filter(
        preference =>
          preference.notificationType === 'messages' &&
          preference.channel === 'chat_sound',
      );
      return settings.length > 0 ? settings[0] : undefined;
    }),
  );

  constructor(
    private auth: Auth,
    private changeDetectorRef: ChangeDetectorRef,
    private datastore: Datastore,
    private modalService: ModalService,
    private router: Router,
    private timeUtils: TimeUtils,
    private videochat: Videochat,
    private webSocketService: WebSocketService,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    this.messagingChat.cleanStoredDraftMessages();

    this.searchText$ = this.searchFormControl.valueChanges.pipe(
      startWith(''),
      publishReplay(1),
      refCount(),
      distinctUntilChanged(),
    );

    this.threadSearchMode$ = Rx.merge(
      this.threadSearchSelected$.pipe(
        map(selected => (selected ? SearchMode.THREAD : SearchMode.USER)),
      ),
      this.searchFormControl.valueChanges.pipe(
        filter(text => text.trim() === ''),
        mapTo(SearchMode.USER),
      ),
    ).pipe(publishReplay(1), refCount());

    this.showThreadSearchOption$ = Rx.combineLatest([
      this.threadSearchMode$,
      this.searchFormControl.valueChanges.pipe(
        startWith(''),
        debounceTime(250),
      ),
    ]).pipe(
      map(([mode, text]) => mode === SearchMode.USER && text.trim() !== ''),
      startWith(false),
    );

    const threadSearchTerm$ = Rx.combineLatest([
      this.searchText$,
      this.threadSearchMode$,
    ]).pipe(
      map(([searchTerm, searchMode]) => {
        if (searchMode === SearchMode.USER || searchTerm.trim() === '') {
          return undefined;
        }
        return searchTerm.trim();
      }),
      filter(isDefined),
      // debounceTime(500),
      map(searchTerm => ({ searchTerm })),
    );

    this.searchThreads$ = this.datastore
      .collection<SearchThreadsCollection>('searchThreads', query =>
        query.search(threadSearchTerm$.pipe(debounceTime(500))).limit(100),
      )
      .valueChanges()
      .pipe(startWithEmptyList());

    this.showThreadListSpinner$ = Rx.merge(
      threadSearchTerm$.pipe(mapTo(true)),
      this.searchThreads$.pipe(mapTo(false)),
    ).pipe(
      distinctUntilChanged(),
      startWith(false),
      publishReplay(1),
      refCount(),
    );

    this.showEmptySearchResult$ = Rx.combineLatest([
      this.threadSearchMode$,
      this.showThreadListSpinner$,
      this.searchThreads$,
    ]).pipe(
      map(
        ([searchMode, showLoadingSpinner, searchThreads]) =>
          searchMode === SearchMode.THREAD &&
          !showLoadingSpinner &&
          searchThreads.length === 0,
      ),
      startWith(false),
      publishReplay(1),
      refCount(),
    );

    this.recruiterUserSearchUsername$ = this.searchKeyEnter$.pipe(
      filter(() => this.isRecruiter()),
      map(() => this.searchFormControl.value as string),
      filter(value => value !== undefined && value !== ''),
    );

    this.resetRecruiterSearch$ = this.searchText$.pipe(
      distinctUntilChanged(),
      mapTo(true),
    );

    this.recruiterSearchModeActive$ = Rx.merge(
      this.searchKeyEnter$.pipe(mapTo(true)),
      this.searchText$.pipe(mapTo(false)),
    ).pipe(distinctUntilChanged(), publishReplay(1), refCount());

    this.activeFilter$ = this.activeFilterSubject$
      .asObservable()
      .pipe(distinctUntilChanged());

    this.threads$ = this.datastore
      .collection<ThreadsCollection>('threads', query =>
        query.limit(
          this.threadsLimitSubject$.pipe(
            tap(() => (this.showLoadingMoreSpinner = true)),
          ),
        ),
      )
      .valueChanges()
      .pipe(tap(() => (this.showLoadingMoreSpinner = false)));

    if (this.inboxMode) {
      this.unreadThreads$ = this.datastore
        .collection<ThreadsCollection>('threads', query =>
          query
            .where('isRead', '==', false)
            .limit(
              this.unreadThreadsLimitSubject$.pipe(
                tap(() => (this.showLoadingMoreSpinner = true)),
              ),
            ),
        )
        .valueChanges()
        .pipe(tap(() => (this.showLoadingMoreSpinner = false)));
      this.allThreads$ = Rx.combineLatest([
        this.threads$,
        this.unreadThreads$,
      ]).pipe(
        map(([threads, unreads]) =>
          uniqWith([...threads, ...unreads], (t1, t2) => t1.id === t2.id),
        ),
      );
    } else {
      this.unreadThreads$ = Rx.of([]);
      this.allThreads$ = this.threads$;
    }

    this.unreadCount$ = this.allThreads$.pipe(
      map(threads =>
        threads
          .map(thread => thread.messageUnreadCount)
          .reduce((a, b) => a + b, 0),
      ),
    );

    this.threadSubscription = this.allThreads$.subscribe(ts => {
      const currentlyHidden = this.isHidden;
      this.isHidden = !this.inboxMode && !(ts && ts.length !== 0);
      if (this.isHidden !== currentlyHidden) {
        this.changeDetectorRef.markForCheck();
      }
    });

    this.sortedThreads$ = Rx.combineLatest([
      this.activeFilterSubject$,
      this.threads$,
      this.unreadThreads$,
    ]).pipe(
      map(([activeFilter, threads, unreads]) =>
        activeFilter === 'unread' ? unreads : threads,
      ),
      map(ts => [...ts].sort((a, b) => b.timeUpdated - a.timeUpdated)),
      publishReplay(1),
      refCount(),
    );

    // FIXME: this shouldn't be subscribed to when not on the Inbox?
    this.emptyThreadNavigateSubscription = Rx.combineLatest([
      this.messagingChat.getInboxViewState(),
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        mapTo(true),
        startWith(true),
      ),
      this.sortedThreads$,
    ]).subscribe(([viewState, _, threads]) => {
      // if the thread list is supposed to be a page, stay on it
      if (viewState === InboxViewState.PAGE) {
        return;
      }

      // otherwise, navigate to the most recent thread if we don't have one open
      const urlTree = this.router.parseUrl(this.router.url);
      const currentUrl = urlTree.root.children[PRIMARY_OUTLET];
      if (
        threads.length > 0 &&
        currentUrl &&
        currentUrl.segments.length === 1 &&
        currentUrl.segments[0].path === 'messages'
      ) {
        const threadId =
          urlTree.fragment && urlTree.fragment.includes('thread/')
            ? urlTree.fragment.split('thread/')[1]
            : threads[0].id;
        this.router.navigate([`/messages/thread/${threadId}`], {
          queryParams: {},
          replaceUrl: true,
        });
      }
    });

    const userIds$ = Rx.combineLatest([
      this.allThreads$,
      this.searchThreads$,
    ]).pipe(
      map(([all, search]) =>
        [...all, ...search]
          .map(t => t.members)
          .reduce((acc, arr) => [...acc, ...arr], []),
      ),
      map(members => Array.from(new Set(members))),
    );

    this.users$ = this.datastore
      .collection<UsersCollection>('users', userIds$)
      .valueChanges()
      .pipe(startWithEmptyList(), asObject(), publishReplay(1), refCount());

    this.onlineOfflineStatuses$ = this.datastore
      .collection<OnlineOfflineCollection>('onlineOffline', userIds$)
      .valueChanges();

    const projectIds$ = Rx.combineLatest([
      this.allThreads$,
      this.searchThreads$,
    ]).pipe(
      map(([all, search]) =>
        threadToContextIds([...all, ...search], ContextTypeApi.PROJECT),
      ),
    );

    this.projects$ = this.datastore
      .collection<ThreadProjectsCollection>('threadProjects', projectIds$)
      .valueChanges()
      .pipe(
        map(projects =>
          projects.reduce(
            (obj, project) => ({ ...obj, [project.id]: project }),
            {},
          ),
        ),
        startWith<{ [key: number]: ThreadProject }>({}),
        publishReplay(1),
        refCount(),
      );

    const contestIds$ = Rx.combineLatest([
      this.allThreads$,
      this.searchThreads$,
    ]).pipe(
      map(([all, search]) =>
        threadToContextIds([...all, ...search], ContextTypeApi.CONTEST),
      ),
    );

    this.contests$ = this.datastore
      .collection<ContestsCollection>('contests', contestIds$)
      .valueChanges()
      .pipe(
        map(contests =>
          contests.reduce(
            (obj, contest) => ({ ...obj, [contest.id]: contest }),
            {},
          ),
        ),
        startWith<{ [key: number]: Contest }>({}),
        publishReplay(1),
        refCount(),
      );

    this.showFilterSwitch$ = this.threadSearchMode$.pipe(
      map(mode => mode !== SearchMode.THREAD),
      distinctUntilChanged(),
      startWith(true),
      publishReplay(1),
      refCount(),
    );

    this.teams$ = this.datastore
      .collection<TeamsCollection>('teams', query =>
        query.where(
          'members',
          'includes',
          this.userId$.pipe(map(id => toNumber(id))),
        ),
      )
      .valueChanges()
      .pipe(asObject(), startWith({} as { [key: number]: Team }));

    this.threadSets$ = combineLatestExtended([
      this.sortedThreads$,
      this.searchText$,
      this.activeFilterSubject$,
      this.users$,
      this.contests$,
      this.projects$,
      this.searchThreads$,
      this.threadSearchMode$,
      this.teams$,
    ]).pipe(
      map(
        ([
          sortedThreads,
          searchText,
          activeFilter,
          users,
          contests,
          projects,
          searchThreads,
          threadSearchMode,
          teams,
        ]) => {
          const predefinedThreadSets: { [Key in ThreadSetKey]: ThreadSet } = {
            [ThreadSetKey.SEARCH]: {
              title: 'Search Results',
              threads: [],
              index: ThreadSetIndex.SEARCH,
            },
            [ThreadSetKey.ACTIVE]: {
              title: undefined,
              threads: [],
              index: ThreadSetIndex.ACTIVE,
            },
            [ThreadSetKey.OTHER]: {
              title: 'Other chats',
              threads: [],
              index: ThreadSetIndex.OTHER,
            },
          };
          // Create a ThreadSet for each team the user is in.
          const threadSets: { [key: string]: ThreadSet } = Object.values(
            teams,
          ).reduce(
            (sets, team) => ({
              ...sets,
              [`team_${team.id.toString()}`]: {
                title: team.name,
                threads: [],
                index: ThreadSetIndex.TEAMS,
              },
            }),
            predefinedThreadSets,
          );
          if (
            threadSearchMode === SearchMode.THREAD &&
            searchText.trim() !== ''
          ) {
            threadSets[ThreadSetKey.SEARCH].threads = [...searchThreads];
          } else {
            sortedThreads
              .filter(thread => {
                switch (activeFilter) {
                  case 'active':
                    return thread.folder !== 'archived';
                  case 'unread':
                    return !thread.isRead;
                  case 'support':
                    return (
                      thread.folder !== 'archived' &&
                      thread.threadType === 'admin_preferred_chat' &&
                      thread.context.type === 'support_session'
                    );
                  case 'archived':
                    return thread.folder === 'archived';
                  default:
                    return assertNever(activeFilter);
                }
              })
              .filter(thread => this.isSearchMatch(thread, searchText, users))
              .forEach(thread => {
                const threadSetKey = ThreadSetKey.ACTIVE;
                threadSets[threadSetKey].threads = [
                  ...threadSets[threadSetKey].threads,
                  thread,
                ];
              });
          }
          return Object.values(threadSets).sort((x, y) => x.index - y.index);
        },
      ),
      publishReplay(1),
      refCount(),
    );

    this.canLoadMore$ = Rx.combineLatest([
      this.sortedThreads$,
      this.threadSearchMode$,
      this.activeFilterSubject$,
    ]).pipe(
      map(([threads, threadSearchMode, activeFilter]) => {
        if (threadSearchMode !== SearchMode.USER) {
          return false;
        }

        if (activeFilter === 'unread') {
          return (
            this.currentUnreadThreadsLimit < this.maxLimit &&
            threads.length >= this.currentUnreadThreadsLimit
          );
        }

        return (
          this.currentThreadsLimit < this.maxLimit &&
          threads.length >= this.currentThreadsLimit
        );
      }),
    );

    this.callAlertSubscription = websocketListener(
      this.webSocketService,
      this.auth.authState$,
      this.inCall$.pipe(distinctUntilChanged()),
    ).subscribe(evt => {
      if (evt !== undefined) {
        if (evt.type !== CallType.NONE) {
          this.popCallAlertModal(evt);
        } else {
          this.makingCall.next(!!evt.makingCall);
          this.modalService.close();
        }
      }
    });

    /**
     * This subscription will call startChat on chats with recent unread messages on page load.
     * We do this because it's possible to receive messages while loading a page,
     * which then don't pop chats by themselves.
     *
     * This is a hack that can be removed once everything is an SPA.
     */
    this.startChatSubscription = Rx.combineLatest([
      this.allThreads$.pipe(
        // stay for fresh backend fetch results
        takeUntil(this.timeUtils.rxTimer(30_000)),
      ),
      Rx.of(Date.now()),
    ]).subscribe(([threads, compareTime]) =>
      threads.map(t => {
        if (
          !this.autoOpenedThreads[t.id] &&
          t.messageUnreadCount > 0 &&
          t.message &&
          compareTime - t.message.timeCreated < 30_000 // 30s to account for page load times
        ) {
          this.autoOpenedThreads[t.id] = true;
          this.messagingChat.startChat({
            userIds: t.members,
            threadType: t.threadType,
            origin: 'contactList',
            context: t.context,
            threadId: t.id,
            focus: false,
            doNotRedirect: true,
          });
        }
      }),
    );
  }

  ngOnDestroy() {
    if (this.threadSubscription) {
      this.threadSubscription.unsubscribe();
    }
    if (this.callAlertSubscription) {
      this.callAlertSubscription.unsubscribe();
    }
    if (this.emptyThreadNavigateSubscription) {
      this.emptyThreadNavigateSubscription.unsubscribe();
    }
    if (this.startChatSubscription) {
      this.startChatSubscription.unsubscribe();
    }
  }

  toggleMinimise() {
    this.minimise.emit(!this.isMinimised);
  }

  setChatSoundSetting({
    setting,
    enabled,
  }: {
    setting: NotificationsPreferenceEntry;
    enabled: boolean;
  }) {
    // FIXME: error handling?
    this.notificationSettingsCollection.set('chat_sound', {
      ...setting,
      enabled,
    });
  }

  handleSearchKeyEnter() {
    this.searchKeyEnterSubject$.next(true);
  }

  handleThreadSelected(thread: Thread) {
    if (this.inboxMode) {
      this.router.navigate([`/messages/thread/${thread.id}`], {
        queryParams: {},
      });
    } else {
      this.messagingChat.startChat({
        userIds: thread.members,
        threadType: thread.threadType,
        origin: 'ng-contact-list',
        context: thread.context,
        threadId: thread.id,
        focus: true,
      });
    }
  }

  handleThreadSearchSelected() {
    this.threadSearchSelectedSubject$.next(true);
  }

  isRecruiter(): boolean {
    return isSupportUser(this.currentUser);
  }

  handleSearchUserSelected(user: User) {
    this.messagingChat.startChat({
      userIds: [user.id],
      threadType: ThreadTypeApi.ADMIN_PREFERRED_CHAT,
      origin: 'ng-contact-list-user-search',
      context: {
        type: ContextTypeApi.SUPPORT_CHAT,
        id: user.id,
      },
    });
  }

  handleFilterSwitched(f: Filter) {
    this.activeFilterSubject$.next(f);
  }
  private isSearchMatch(
    thread: Thread,
    searchTerm: string,
    users: UserDict,
  ): boolean {
    return this.getUsersForSearch(thread, users)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  }
  private getUsersForSearch(thread: Thread, users: UserDict) {
    return thread.otherMembers
      .filter(u => Boolean(u && users[u]))
      .map(u => [users[u].displayName, users[u].username].join(', '))
      .join(', ');
  }

  popCallAlertModal(callEvent: CallEvent) {
    this.modalService
      .open(CallAlertModalComponent, {
        inputs: {
          otherUserIds: callEvent.otherMembers,
          callType: callEvent.type,
          threadId: callEvent.threadId,
        },
        size: ModalSize.SMALL,
      })
      .afterClosed()
      .pipe(withLatestFrom(this.inCall$))
      .toPromise()
      .then(([accept, inCall]) => {
        if (inCall) {
          return;
        }
        if (accept) {
          this.videochat.openCallWindow(
            callEvent.type,
            callEvent.threadId,
            true,
          );
          this.videochat.notifyAction('accept', callEvent.threadId);
        } else {
          this.videochat.notifyAction('reject', callEvent.threadId);
        }
      });
  }

  handleLoadThreads() {
    const activeFilter = this.activeFilterSubject$.getValue();
    if (activeFilter === 'unread') {
      this.currentUnreadThreadsLimit = Math.min(
        this.currentUnreadThreadsLimit + this.limitIncreaseStep,
        this.maxLimit,
      );
      this.unreadThreadsLimitSubject$.next(this.currentUnreadThreadsLimit);
    } else {
      this.currentThreadsLimit = Math.min(
        this.currentThreadsLimit + this.limitIncreaseStep,
        this.maxLimit,
      );
      this.threadsLimitSubject$.next(this.currentThreadsLimit);
    }
  }
}
