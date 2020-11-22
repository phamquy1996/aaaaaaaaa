import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Auth } from '@freelancer/auth';
import {
  arrayIsShallowEqual,
  asObject,
  Datastore,
  DatastoreDocument,
  isWebsocketMessage,
  Query,
  startWithEmptyList,
  WebSocketService,
} from '@freelancer/datastore';
import {
  Contact,
  ContactsCollection,
  NotificationsPreferencesCollection,
  Team,
  TeamsCollection,
  Thread,
  ThreadsCollection,
  ThreadType,
  UsersCollection,
} from '@freelancer/datastore/collections';
import {
  FocusState,
  LocalStorage,
  SavedChatAttributes,
  ThreadIdentifier,
} from '@freelancer/local-storage';
import { Chat, MessagingChat } from '@freelancer/messaging-chat';
import { Sounds } from '@freelancer/sounds';
import { toNumber } from '@freelancer/utils';
import { ResizeEvent } from 'angular-resizable-element';
import {
  ContextTypeApi,
  FolderApi,
  PrivacyLevelApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  publishReplay,
  refCount,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ChatAttributes } from './chat-box/chat-box.component';
import {
  buildThreadIdentifier,
  getTeamFromChat,
  isSupportUser,
  threadsEqual,
} from './helpers';

// TODO: consider passing chat attributes individually rather than as one object
@Component({
  selector: 'app-messaging-chat',
  template: `
    <ng-container *ngFor="let chat of chats; trackBy: identifyChat">
      <app-messaging-chat-box
        *ngIf="showNewChatBox$ | async; else oldChatbox"
        class="InteractableChatbox"
        [team$]="getTeamFromChat(teams$, chat)"
        [thread$]="chat.thread$"
      ></app-messaging-chat-box>
      <ng-template #oldChatbox>
        <app-chat-box
          *ngIf="chat.visible"
          mwlResizable
          class="InteractableChatbox"
          [resizeEdges]="{ top: true, left: true }"
          [enableGhostResize]="true"
          [validateResize]="validateResizeFunc"
          [ngStyle]="{
            height: chat.height + 'px',
            width: chat.width + 'px'
          }"
          [resizeCursorPrecision]="10"
          (resizeEnd)="onResizeEnd($event, chat)"
          flTrackingSection="chatbox"
          [attributes]="chat"
          [allContacts$]="contacts$"
          [inCall$]="inCall$"
          [currentUserIdValue]="currentUserIdValue"
          [team$]="getTeamFromChat(teams$, chat)"
          (closeChat)="closeChat($event)"
          (minimiseChat)="minimiseChat($event)"
          (focusClick)="focusClick($event)"
          (makingCall)="passMakingCallState($event)"
        ></app-chat-box>
      </ng-template>
    </ng-container>
  `,
  styleUrls: ['./messaging-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingChatComponent implements OnInit, OnDestroy {
  @Input() adminChatsOnly = false;
  @Input() inCall$: Rx.Observable<boolean>;
  @Input() clickedOutside$: Rx.Observable<boolean>;
  @Output() makingCall = new EventEmitter<boolean>();

  chats: ReadonlyArray<ChatAttributes> = [];
  contacts$: Rx.Observable<ReadonlyArray<Contact>>;
  currentUserId$: Rx.Observable<string>;
  currentUserDoc: DatastoreDocument<UsersCollection>;
  currentUserIdSubscription?: Rx.Subscription;
  currentUserIdValue: string;
  webSocketSubscription?: Rx.Subscription;
  messageNotifySubscription?: Rx.Subscription;
  clickedOutsideSubscription?: Rx.Subscription;
  errors: { [threadId: string]: { failedMessage: string; error: string } } = {};
  teams$: Rx.Observable<{ [key: number]: Team }>;

  showNewChatBox$: Rx.Observable<boolean>;

  getTeamFromChat = getTeamFromChat;

  SUPPORT_CHATS_LIMIT = 20;

  validateResizeFunc: (r: ResizeEvent) => boolean;

  constructor(
    private auth: Auth,
    private activatedRoute: ActivatedRoute,
    private datastore: Datastore,
    private webSocketService: WebSocketService,
    private sounds: Sounds,
    private changeDetectorRef: ChangeDetectorRef,
    private messagingChat: MessagingChat,
    private localStorage: LocalStorage,
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.limitChatHeight();
    this.updateChatOverflow();
  }

  @HostListener('window:beforeunload')
  beforeUnload() {
    this.saveChats(this.chats);
  }

  ngOnInit() {
    this.showNewChatBox$ = this.activatedRoute.queryParams.pipe(
      map(queryParams => convertToParamMap(queryParams).has('new_chatbox')),
      distinctUntilChanged(),
    );

    this.currentUserId$ = this.auth.getUserId();
    this.messagingChat.registerLiveChat(chat => this.startChat(chat));

    this.messagingChat.cleanStoredDraftMessages();
    this.currentUserIdSubscription = this.currentUserId$.subscribe(id => {
      this.currentUserIdValue = id;
    });

    this.currentUserDoc = this.datastore.document<UsersCollection>(
      'users',
      this.currentUserId$,
    );

    // We need to load chats before any updates to chats
    // Loaded chats do not have their threads, so we need to create them again
    this.loadChats().then(() => this.limitChatHeight());

    const soundsEnabled$ = this.datastore
      .collection<NotificationsPreferencesCollection>(
        'notificationsPreferences',
      )
      .valueChanges()
      .pipe(
        map(preferences => {
          const settings = preferences.filter(
            preference =>
              preference.notificationType === 'messages' &&
              preference.channel === 'chat_sound',
          );
          return settings.length > 0 ? settings[0].enabled : false;
        }),
      );

    this.messageNotifySubscription = this.webSocketService.fromServerStream$
      .pipe(
        withLatestFrom(this.currentUserId$, soundsEnabled$),
        filter(([wsm, currentUserId, soundsEnabled]) => {
          if (
            soundsEnabled &&
            isWebsocketMessage(wsm) &&
            wsm.body.parent_type === 'messages' &&
            wsm.body.type === 'private' &&
            wsm.body.data.from_user.toString() !== currentUserId &&
            !this.isHiddenThread(wsm.body.data.thread_details.thread_type)
          ) {
            const threadId = wsm.body.data.thread_id;
            const chat = this.chats.find(
              c => c.threadIdentifier.id === threadId,
            );
            return (
              chat !== undefined &&
              (chat.focus === FocusState.Neither ||
                chat.focus === FocusState.Header)
            );
          }
          return false;
        }),
      )
      .subscribe(() => this.sounds.handleNotification('message'));

    this.contacts$ = this.currentUserDoc.valueChanges().pipe(
      map(isSupportUser),
      distinctUntilChanged(),
      switchMap(isRecruiter => {
        if (isRecruiter) {
          return Rx.NEVER;
        }
        return this.datastore
          .collection<ContactsCollection>('contacts')
          .valueChanges();
      }),
      startWithEmptyList(),
      publishReplay(1),
      refCount(),
    );

    this.teams$ = this.datastore
      .collection<TeamsCollection>('teams', query =>
        query.where(
          'members',
          'includes',
          this.currentUserId$.pipe(map(id => toNumber(id))),
        ),
      )
      .valueChanges()
      .pipe(asObject(), startWith({} as { [key: number]: Team }));

    this.clickedOutsideSubscription = this.clickedOutside$.subscribe(
      clickedOutside => {
        if (clickedOutside) {
          this.blur();
        }
      },
    );

    // declare this as an arrow function to lock the scope to this component
    this.validateResizeFunc = (event: ResizeEvent) =>
      event.rectangle.width !== undefined &&
      event.rectangle.height !== undefined &&
      this.messagingChat.isValidChatboxDimensions({
        width: event.rectangle.width,
        height: event.rectangle.height,
      });
  }

  blur(ignoreTarget?: ChatAttributes) {
    this.chats = this.chats.map(c => ({
      ...c,
      focus: ignoreTarget && c === ignoreTarget ? c.focus : FocusState.Neither,
    }));
  }

  onResizeEnd(event: ResizeEvent, resizedChatAttrs: ChatAttributes) {
    const { width, height } = event.rectangle;
    if (width === undefined || height === undefined) {
      return;
    }
    const dimensions = this.messagingChat.constrainChatboxDimensions({
      width,
      height,
    });

    if (this.chats) {
      // Assuming there is only ever one chat thread that can match.
      this.blur();
      const matchingChatIndex = this.chats.findIndex(c =>
        threadsEqual(c.threadIdentifier, resizedChatAttrs.threadIdentifier),
      );
      if (matchingChatIndex >= 0) {
        this.chats = this.getUpdatedChats(matchingChatIndex, {
          ...this.chats[matchingChatIndex],
          height: dimensions.height,
          width: dimensions.width,
          focus: FocusState.HeaderAndTypingBox,
          lastUpdate: Date.now(),
        });
        this.saveChats(this.chats);
        this.updateChatOverflow();
      }
    }
  }

  startChat({
    userIds,
    threadType,
    origin,
    context = { type: ContextTypeApi.NONE },
    threadId,
    focus,
  }: Chat) {
    const members = Array.from(
      new Set([...userIds, Number(this.currentUserIdValue)]),
    );
    if (members.length < 2 && !threadId) {
      return;
    }
    // Negative to avoid thread id collisions with real threads
    const id = threadId || Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);

    const initialThreadIdentifier = {
      id,
      threadType,
      context,
      members,
      isFake: id < 0,
    };

    const matchingChat = this.chats.find(chat =>
      threadsEqual(initialThreadIdentifier, chat.threadIdentifier),
    );
    if (matchingChat === undefined) {
      // If there is no pre-existing chat unfocus all the prior ones before adding.
      if (focus) {
        this.blur();
      }
      // Allow only SUPPORT_CHATS_LIMIT support chats until T94258 resolved
      if (
        threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT &&
        (context.type === ContextTypeApi.SUPPORT_CHAT ||
          context.type === ContextTypeApi.SUPPORT_SESSION)
      ) {
        const supportChats = this.chats.filter(
          chat =>
            chat.threadIdentifier.threadType ===
              ThreadTypeApi.ADMIN_PREFERRED_CHAT &&
            (chat.threadIdentifier.context.type ===
              ContextTypeApi.SUPPORT_CHAT ||
              chat.threadIdentifier.context.type ===
                ContextTypeApi.SUPPORT_SESSION),
        );

        if (supportChats && supportChats.length >= this.SUPPORT_CHATS_LIMIT) {
          const oldestSupportChat = supportChats[supportChats.length - 1];
          this.closeChat(oldestSupportChat.threadIdentifier);
        }
      }

      this.chats = [
        this.createChatAttributes(initialThreadIdentifier, focus),
        ...this.chats,
      ];
      this.changeDetectorRef.markForCheck();
    } else {
      // Otherwise, update said chat box.
      const ix = this.chats.indexOf(matchingChat);
      if (ix >= 0) {
        // Only blur out other chats to avoid duplicate change detection.
        if (focus) {
          this.blur(matchingChat);
        }
        this.chats = this.getUpdatedChats(ix, {
          ...matchingChat,
          focus: focus ? FocusState.HeaderAndTypingBox : matchingChat.focus,
          minimised: focus ? false : matchingChat.minimised,
          lastUpdate: Date.now(),
        });
      }
    }
    this.updateChatOverflow();
    this.saveChats(this.chats);
  }

  createChatAttributes(
    threadIdentifier: ThreadIdentifier,
    focus: boolean = true,
    width: number = 280,
    height: number = -1,
    minimised: boolean = false,
  ): ChatAttributes {
    const otherMembers: ReadonlyArray<number> =
      threadIdentifier.members.length > 0
        ? threadIdentifier.members.filter(
            uid => uid !== Number(this.currentUserIdValue),
          )
        : [];
    const now = Date.now();

    const initialThread: Thread = {
      context: threadIdentifier.context,
      contextType: threadIdentifier.context.type,
      folder: FolderApi.INBOX,
      id: threadIdentifier.id,
      inactiveMembers: [],
      isFake: threadIdentifier.isFake,
      isMuted: false,
      isBlocked: false,
      isRead: true,
      members: threadIdentifier.members,
      messageUnreadCount: 0,
      otherMembers,
      owner: Number(this.currentUserIdValue),
      threadType: threadIdentifier.threadType,
      timeCreated: now,
      timeRead: now,
      timeUpdated: now,
      userReadTimes: {},
      writePrivacy: PrivacyLevelApi.MEMBERS,
    };

    let queryFunc; // is there a better way of doing this? probably using a query subject
    if (threadIdentifier.id > 0) {
      queryFunc = (query: Query<ThreadsCollection>) =>
        query.where('id', '==', threadIdentifier.id);
    } else {
      queryFunc = (query: Query<ThreadsCollection>) =>
        query
          .where('otherMembers', 'equalsIgnoreOrder', otherMembers)
          .where('context', '==', threadIdentifier.context)
          .where('threadType', 'in', [threadIdentifier.threadType]);
    }

    const threadCollection = this.datastore.collection<ThreadsCollection>(
      'threads',
      queryFunc,
    );

    const thread$ = threadCollection.valueChanges().pipe(
      filter(threads => threads && threads.length !== 0),
      tap(threads => {
        if (threads.length > 1) {
          console.warn(
            `More than 1 thread returned for user ${this.currentUserIdValue}`,
            threadIdentifier,
          );
        }
      }),
      map(threads => threads[0]),
      tap(t => {
        this.updateThreadIdentifier(buildThreadIdentifier(t));
      }),
      startWith(initialThread),
      publishReplay(1),
      refCount(),
    );

    return {
      minimised,
      focus: focus ? FocusState.HeaderAndTypingBox : FocusState.Neither,
      width,
      height,
      lastUpdate: Date.now(),
      visible: true,
      threadCollection,
      thread$,
      threadIdentifier,
    };
  }

  focusLastUpdatedChatbox() {
    // find the most recently updated, visible, non-minimised chatbox
    const lastUpdatedChatIndex = this.chats.reduce(
      (bestIndex, chat, currIndex) =>
        chat.visible &&
        !chat.minimised &&
        (!this.chats[bestIndex] ||
          chat.lastUpdate > this.chats[bestIndex].lastUpdate)
          ? currIndex
          : bestIndex,
      -1,
    );
    if (lastUpdatedChatIndex >= 0) {
      this.chats = this.getUpdatedChats(lastUpdatedChatIndex, {
        ...this.chats[lastUpdatedChatIndex],
        focus: FocusState.HeaderAndTypingBox,
      });
    }
  }

  closeChat(threadIdentifier: ThreadIdentifier) {
    const closedChatIndex = this.chats.findIndex(c =>
      threadsEqual(c.threadIdentifier, threadIdentifier),
    );
    if (closedChatIndex !== -1) {
      const wasFocused =
        this.chats[closedChatIndex].focus !== FocusState.Neither;
      this.chats = this.chats.filter(
        c => !threadsEqual(c.threadIdentifier, threadIdentifier),
      );
      this.updateChatOverflow();
      if (wasFocused) {
        this.focusLastUpdatedChatbox();
      }
      this.saveChats(this.chats);
    }
  }

  minimiseChat(threadIdentifier: ThreadIdentifier) {
    const matchingChatIndex = this.chats.findIndex(c =>
      threadsEqual(c.threadIdentifier, threadIdentifier),
    );
    if (matchingChatIndex >= 0) {
      this.chats = this.getUpdatedChats(matchingChatIndex, {
        ...this.chats[matchingChatIndex],
        minimised: !this.chats[matchingChatIndex].minimised,
      });
      this.saveChats(this.chats);
    }
  }

  passMakingCallState(state: boolean) {
    this.makingCall.emit(state);
  }

  updateThreadIdentifier(threadIdentifier: ThreadIdentifier) {
    const matchingChatIndex = this.chats.findIndex(c =>
      threadsEqual(c.threadIdentifier, threadIdentifier),
    );
    if (matchingChatIndex < 0) {
      return;
    }
    const matchingChat = this.chats[matchingChatIndex];
    if (
      threadIdentifier.id === matchingChat.threadIdentifier.id &&
      threadIdentifier.isFake === matchingChat.threadIdentifier.isFake &&
      arrayIsShallowEqual(
        threadIdentifier.members,
        matchingChat.threadIdentifier.members,
      )
    ) {
      return;
    }
    this.chats = this.getUpdatedChats(matchingChatIndex, {
      ...matchingChat,
      threadIdentifier: {
        ...threadIdentifier,
      },
    });
  }

  ngOnDestroy() {
    if (this.currentUserIdSubscription) {
      this.currentUserIdSubscription.unsubscribe();
    }
    if (this.webSocketSubscription) {
      this.webSocketSubscription.unsubscribe();
    }
    if (this.messageNotifySubscription) {
      this.messageNotifySubscription.unsubscribe();
    }
    if (this.clickedOutsideSubscription) {
      this.clickedOutsideSubscription.unsubscribe();
    }
    if (this.messagingChat) {
      this.messagingChat.unregisterLiveChat();
    }
  }

  focusClick(threadIdentifier: ThreadIdentifier) {
    const isFocusTarget = (c: ChatAttributes) =>
      threadsEqual(c.threadIdentifier, threadIdentifier);
    // TODO: do not mutate chat attribute objects
    this.chats = this.chats.map(c =>
      isFocusTarget(c)
        ? {
            ...c,
            focus: FocusState.HeaderAndTypingBox,
            lastUpdate: Date.now(),
          }
        : {
            ...c,
            focus: FocusState.Neither,
          },
    );
  }

  // This somewhat mirrors the backend hashing logic we have
  identifyChat(index: number, chat: ChatAttributes) {
    // At least on the front end, we assume that we always have the thread ID for group chats
    if (chat.threadIdentifier.threadType === 'group') {
      return chat.threadIdentifier.id.toString();
    }
    const memberString = `[${[...chat.threadIdentifier.members]
      .sort()
      .toString()}]`;
    if (chat.threadIdentifier.context.type === ContextTypeApi.NONE) {
      return `${chat.threadIdentifier.threadType}:${memberString}`;
    }
    const contextString = `${chat.threadIdentifier.context.type}:${chat.threadIdentifier.context.id}`;
    return `${chat.threadIdentifier.threadType}:${contextString}:${memberString}`;
  }

  /* Picks which chats to display on the screen (if there are too many)
   * Prioritises the currently-focused one, then the most recently updated ones.
   */
  updateChatOverflow() {
    // order chats by most recent (with focused chat always first)
    // hides non-admin chats if we're on a hide messaging page (eg. the PPP)
    const recentChats = this.chats
      .filter(
        c =>
          !this.isHiddenThread(c.threadIdentifier.threadType) &&
          c.focus === FocusState.Neither,
      )
      .sort((a, b) => b.lastUpdate - a.lastUpdate);
    const focusIndex = this.chats.findIndex(
      c =>
        !this.isHiddenThread(c.threadIdentifier.threadType) &&
        c.focus !== FocusState.Neither,
    );
    if (focusIndex !== -1) {
      recentChats.unshift(this.chats[focusIndex]);
    }
    const recentChatIds = this.messagingChat
      .fitChatsToScreen(recentChats, {
        // width of the contact list
        offset: 210,
        // with a gap in between
        gap: 8,
      })
      .map(chat => chat.threadIdentifier.id);
    this.chats = this.chats.map(c => ({
      ...c,
      visible: recentChatIds.includes(c.threadIdentifier.id),
    }));
  }

  getUpdatedChats(
    index: number,
    updatedChat: ChatAttributes,
  ): ReadonlyArray<ChatAttributes> {
    if (index < 0 || index > this.chats.length - 1) {
      return this.chats;
    }
    this.changeDetectorRef.markForCheck();
    return [
      ...this.chats.slice(0, index),
      updatedChat,
      ...this.chats.slice(index + 1, this.chats.length),
    ];
  }

  isHiddenThread(t: ThreadType) {
    return (
      // TODO: This does not handle group chats created by support agents.
      // It will need to take into account the thread context type.
      this.adminChatsOnly &&
      t !== 'admin_preferred_chat' &&
      t !== 'support_chat'
    );
  }

  saveChats(chats: ReadonlyArray<ChatAttributes>) {
    const savedChats: SavedChatAttributes = chats.map(chat => ({
      minimised: chat.minimised,
      focus: chat.focus,
      width: chat.width,
      height: chat.height,
      threadIdentifier: chat.threadIdentifier,
    }));
    this.localStorage.set('webappChats', savedChats);
  }

  loadChats(): Promise<void | ReadonlyArray<ChatAttributes>> {
    return this.localStorage
      .get('webappChats')
      .pipe(take(1))
      .toPromise()
      .then(chatsFromStorage => {
        if (chatsFromStorage) {
          this.chats = chatsFromStorage
            .filter(c => !c.threadIdentifier.isFake)
            .map(c =>
              this.createChatAttributes(
                c.threadIdentifier,
                false,
                c.width,
                c.height,
                c.minimised,
              ),
            );
        } else {
          this.chats = [];
        }
        this.updateChatOverflow();
        this.changeDetectorRef.markForCheck();
      });
  }

  limitChatHeight() {
    // use default height if any of the chats exceeds maximum height
    const {
      max: { height: maxHeight },
    } = this.messagingChat.getDimensionLimits();
    this.chats = this.chats.map(chat => {
      if (chat.height > maxHeight) {
        return {
          ...chat,
          height: 380,
        };
      }

      return chat;
    });
    this.saveChats(this.chats);
  }
}
