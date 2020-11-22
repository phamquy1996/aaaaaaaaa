import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ABTest } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import {
  combineLatestExtended,
  Datastore,
  DatastoreCollection,
  DatastoreDocument,
  isWebsocketMessage,
  startWithEmptyList,
  WebSocketService,
} from '@freelancer/datastore';
import {
  Agent,
  AgentsCollection,
  AgentSession,
  AgentSessionsCollection,
  BidsCollection,
  Contact,
  ContestsCollection,
  HourlyContract,
  HourlyContractsCollection,
  InvoicesCollection,
  Message,
  MessagesCollection,
  MessageSendStatus,
  MilestoneRequestsCollection,
  MilestonesCollection,
  OnlineOfflineCollection,
  OnlineOfflineUserStatus,
  OnlineOfflineUserStatusValue,
  Team,
  Thread,
  ThreadProjectsCollection,
  ThreadsCollection,
  User,
  UsersCollection,
} from '@freelancer/datastore/collections';
import { Feature, FeatureFlagsService } from '@freelancer/feature-flags';
import {
  FileUploadLegacy,
  FileUploadSession,
  UploadStatus,
} from '@freelancer/file-upload-legacy';
import {
  DraftMessage,
  FocusState,
  LocalStorage,
  ThreadIdentifier,
} from '@freelancer/local-storage';
import { TimeUtils } from '@freelancer/time-utils';
import { Tracking } from '@freelancer/tracking';
import { ModalService } from '@freelancer/ui';
import { BannerAlertType } from '@freelancer/ui/banner-alert';
import { DrawerComponent } from '@freelancer/ui/drawer';
import { Margin } from '@freelancer/ui/margin';
import { ModalSize } from '@freelancer/ui/modal';
import { StickyBehaviour, StickyPosition } from '@freelancer/ui/sticky';
import {
  FontColor,
  FontWeight,
  TextAlign,
  TextSize,
} from '@freelancer/ui/text';
import { UserAgent } from '@freelancer/user-agent';
import { isDefined, partition, toNumber } from '@freelancer/utils';
import {
  ContextTypeApi,
  FolderApi,
  SourceTypeApi as MessageSourceType,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { ProjectInvoiceMilestoneLinkedStatusesApi } from 'api-typings/payments/payments';
import {
  BidAwardStatusApi,
  ProjectTypeApi,
} from 'api-typings/projects/projects';
import {
  AgentStateApi,
  SourceTypeApi as SessionSourceType,
} from 'api-typings/support/support';
import {
  createThreadBody,
  getThreadIdentifierKey,
} from 'app/messaging/messaging-chat/helpers';
import { MessagingInboxComponent } from 'app/messaging/messaging-inbox/messaging-inbox.component';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  flatMap,
  map,
  mapTo,
  publishReplay,
  refCount,
  startWith,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ContextBoxState, StateManager } from '../context-box/state-manager';
import { GroupchatManagementModalComponent } from '../groupchat-management-modal/groupchat-management-modal.component';
import { OnboardingOverlayComponent } from '../onboarding-overlay/onboarding-overlay.component';
import { TypingBoxComponent } from '../typing-box/typing-box.component';

export enum ChatOperation {
  ARCHIVE_CHAT = 'archive-chat',
  BLOCK_CHAT = 'block-chat',
  MUTE_CHAT = 'mute-chat',
  SEND_MESSAGE = 'send-message',
}

export enum ChatOperationError {
  FORBIDDEN = 'FORBIDDEN',
  UNKNOWN = 'UNKNOWN_ERROR',
  MESSAGE_REQUIRED = 'MESSAGE_REQUIRED',
}

export interface CallEnabledState {
  audio: boolean;
  video: boolean;
  reason?: string;
}

// Per https://github.com/angular/angular-cli/issues/2034
export interface ChatAttributes {
  height: number;
  minimised: boolean;
  focus: FocusState;
  width: number;
  lastUpdate: number;
  threadIdentifier: ThreadIdentifier;
  thread$: Rx.Observable<Thread>;
  threadCollection: DatastoreCollection<ThreadsCollection>;
  visible: boolean;
}
export interface UsersTypingMap {
  [key: number]: Rx.Observable<boolean>;
}

enum Overlay {
  GROUP = 'group',
  SETTINGS = 'settings',
}

@Component({
  selector: 'app-chat-box',
  template: `
    <fl-bit
      class="ChatBox"
      flTrackingSection="{{ chatBoxMode ? 'chatbox' : 'inbox' }}"
    >
      <app-header
        *ngIf="chatBoxMode"
        (click)="toggleMinimised()"
        (closeChat)="close()"
        (handleSettingsHeaderClick)="toggleOverlay(Overlay.SETTINGS)"
        (handleGroupchatHeaderClick)="toggleOverlay(Overlay.GROUP)"
        (makingCall)="passMakingCallState($event)"
        [callsEnabled]="callsEnabled$ | async"
        [isMinimised]="isMinimised"
        [thread]="attributes.thread$ | async"
        [project]="projectDoc.valueChanges() | async"
        [contest]="contestDoc.valueChanges() | async"
        [agentSession]="agentSession$ | async"
        [currentUserId]="currentUserId$ | async"
        [currentUser]="currentUser$ | async"
        [otherMembers]="otherMembers$ | async"
        [onlineOfflineStatuses$]="onlineOfflineStatuses$"
        [focusState]="attributes.focus"
        [isThreadOwner]="isThreadOwner$ | async"
        [candidatesExist]="candidatesExist$ | async"
        [team]="team$ | async"
        [isUserSupportAgent]="isUserSupportAgent$ | async"
        [supportAgentMembers]="supportAgentMembers$ | async"
        data-uitest-target="chatbox-header"
      ></app-header>
      <app-messaging-inbox-header
        class="ChatBox-inboxHeader"
        *ngIf="!chatBoxMode"
        flTrackingSection="inboxheader"
        [emptyState]="false"
        [isOnline]="onlineOffline$ | async"
        [contextBoxState]="contextBoxState$ | async"
        [isGroupChatThread]="isGroupChatThread$ | async"
        [otherMembers]="otherMembers$ | async"
        [flHideDesktop]="true"
        (chatOptionsDrawerToggle)="handleChatOptionsDrawerToggle($event)"
      ></app-messaging-inbox-header>
      <fl-bit class="ChatBox-main">
        <fl-bit class="ChatBox-content">
          <fl-file-select
            class="ChatBox-fileSelect"
            *ngIf="!activeOverlay && !(showOnboardingOverlay$ | async)"
            [multiple]="true"
            (onFileDropped)="handleAddAttachment($event)"
            [active]="
              !attributes.threadIdentifier.isFake &&
              (fileUploadEnabled$ | async)
            "
            data-uitest-target="chatbox-window"
          >
            <!-- TODO pass real input -->
            <ng-container *ngIf="chatBoxMode">
              <fl-bit *ngIf="contextBoxState$ | async; let state">
                <app-context-box
                  class="ChatBox-context"
                  [chatBoxMode]="chatBoxMode"
                  [state]="state"
                ></app-context-box>
              </fl-bit>
            </ng-container>
            <app-message-list
              [currentUserId]="currentUserId$ | async"
              [usersTyping]="usersTyping"
              [members]="allChatMembers$ | async"
              [messages]="sortedMessages$ | async"
              [otherMembers]="otherMembers$ | async"
              [thread]="attributes.thread$ | async"
              [chatBoxMode]="chatBoxMode"
              [canLoadMore]="canLoadMore$ | async"
              [showLoadingMoreSpinner]="messagesLoadingMore$ | async"
              [useThumbnailService]="useThumbnailService$ | async"
              (resendMessage)="handleMessageResend($event)"
              (loadMoreMessages)="handleLoadMessages()"
            ></app-message-list>
            <fl-bit [ngClass]="{ 'Inbox-wrapper': !chatBoxMode }">
              <app-attachment-list
                [thread]="attributes.thread$ | async"
                [attachments]="messageAttachments"
                [uploads]="uploads$ | async"
                (removeAttachment)="handleRemoveAttachment($event)"
                (removeUpload)="handleRemoveUpload($event)"
              ></app-attachment-list>
              <fl-bit *ngIf="error" [ngSwitch]="error?.operation">
                <app-error-alert
                  *ngSwitchCase="ChatOperation.SEND_MESSAGE"
                  i18n="Chat sending error message"
                  (close)="clearThreadError()"
                >
                  <ng-container [ngSwitch]="error.code">
                    <ng-container *ngSwitchCase="ChatOperationError.FORBIDDEN">
                      Unfortunately, you are not allowed to send a message to
                      this thread.
                    </ng-container>
                    <ng-container
                      *ngSwitchCase="ChatOperationError.MESSAGE_REQUIRED"
                    >
                      Please enter a message.
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                      Message sending failed. Please try again or
                      <fl-link
                        flTrackingLabel="ChatSupportLink"
                        [link]="'/support/'"
                      >
                        contact support
                      </fl-link>
                      if issue persists.
                    </ng-container>
                  </ng-container>
                </app-error-alert>
                <app-error-alert
                  *ngSwitchDefault
                  i18n="Chat operations error message"
                  (close)="clearThreadError()"
                >
                  <ng-container [ngSwitch]="error.code">
                    <ng-container *ngSwitchCase="ChatOperationError.FORBIDDEN">
                      Unfortunately, you are not allowed to perform the
                      requested operation.
                    </ng-container>
                    <ng-container *ngSwitchDefault>
                      Attempting to perform requested operation failed. Please
                      try again or
                      <fl-link
                        flTrackingLabel="ChatSupportLink"
                        [link]="'/support/'"
                      >
                        contact support.
                      </fl-link>
                    </ng-container>
                  </ng-container>
                </app-error-alert>
              </fl-bit>
              <app-typing-box
                [ngClass]="{ 'Inbox-typingBox': !chatBoxMode }"
                *ngIf="
                  (isUserSupportAgent$ | async) ||
                  (attributes.thread$ | async)?.writePrivacy !== 'none'
                "
                #typingBox
                class="ChatBox-typingBox"
                [isChatBoxMode]="chatBoxMode"
                [hasAttachments]="messageAttachments.length > 0"
                [thread]="attributes.thread$ | async"
                [threadIdentifierKey]="threadIdentifierKey"
                [flMarginBottom]="Margin.NONE"
                [flSticky]="!chatBoxMode"
                [flStickyBehaviour]="StickyBehaviour.ALWAYS"
                [flStickyPosition]="StickyPosition.BOTTOM"
                (sendMessage)="enqueueMessage($event)"
                (typingEvent)="handleTypingEvent($event)"
                (focusTypingBox)="focusTypingBox()"
                (addAttachment)="handleAddAttachment($event)"
              ></app-typing-box>
              <fl-banner-alert
                *ngIf="
                  !(isUserSupportAgent$ | async) &&
                  (attributes.thread$ | async)?.writePrivacy === 'none'
                "
                type="'warning'"
                [closeable]="false"
                i18n="Chatbox error alert"
                [flMarginBottom]="Margin.XXSMALL"
              >
                You cannot chat with this user
              </fl-banner-alert>
            </fl-bit>
          </fl-file-select>
          <ng-container *ngIf="chatBoxMode">
            <app-onboarding-overlay
              #onboardingOverlay
              *ngIf="showOnboardingOverlay$ | async"
              [hourlyContracts]="hourlyContracts$ | async"
              [thread]="attributes.thread$ | async"
              [otherMembers]="otherMembers$ | async"
              [project]="projectDoc.valueChanges() | async"
              (closeOverlay)="closeOnboardingOverlay()"
            ></app-onboarding-overlay>
            <app-groupchat-overlay
              *ngIf="
                activeOverlay === 'group' && !(showOnboardingOverlay$ | async)
              "
              [participants]="members$ | async"
              [isThreadOwner]="isThreadOwner$ | async"
              [isRecruiter]="isUserSupportAgent$ | async"
              [candidatesExist]="candidatesExist$ | async"
              [currentUser]="currentUser$ | async"
              [candidateBidders]="bidders$ | async"
              [candidateContacts]="contacts$ | async"
              [candidateCollaborators]="collaborators$ | async"
              [onlineOfflineStatuses$]="onlineOfflineStatuses$"
              [thread]="attributes.thread$ | async"
              [team]="team$ | async"
              (hideGroupchatOverlay)="toggleOverlay(Overlay.GROUP)"
              (modifyMembers)="modifyMembers($event)"
              [showAddPeopleOption]="showAddPeopleOption$ | async"
            ></app-groupchat-overlay>
            <app-settings-overlay
              *ngIf="
                activeOverlay === 'settings' &&
                !(showOnboardingOverlay$ | async)
              "
              [thread]="attributes.thread$ | async"
              (archiveChatToggle)="archiveChatToggle()"
              (blockChatToggle)="blockChatToggle()"
              (muteChatToggle)="muteChatToggle()"
              (hideSettingsOverlay)="toggleOverlay(Overlay.SETTINGS)"
            ></app-settings-overlay>
          </ng-container>
        </fl-bit>
        <app-messaging-sidebar
          class="Inbox-sidebar"
          *ngIf="!chatBoxMode"
          [candidatesExist]="candidatesExist$ | async"
          [contextBoxState]="contextBoxState$ | async"
          [currentUser]="currentUser$ | async"
          [isRecruiter]="isUserSupportAgent$ | async"
          [isThreadOwner]="isThreadOwner$ | async"
          [onlineOfflineStatuses$]="onlineOfflineStatuses$"
          [thread]="attributes.thread$ | async"
          [threadId$]="threadId$"
          [members]="members$ | async"
          [team]="team$ | async"
          (archiveChatToggle)="archiveChatToggle()"
          (blockChatToggle)="blockChatToggle()"
          (muteChatToggle)="muteChatToggle()"
          [showAddPeopleOption]="showAddPeopleOption$ | async"
          (userAdd)="popManagementModal()"
          (userRemove)="handleUserRemoved($event)"
          [flHideTablet]="true"
          [flHideMobile]="true"
        ></app-messaging-sidebar>
        <fl-drawer #chatOptionsDrawer>
          <ng-template #drawerTemplate>
            <app-messaging-sidebar
              class="Inbox-chatOptions"
              *ngIf="!chatBoxMode"
              [candidatesExist]="candidatesExist$ | async"
              [contextBoxState]="contextBoxState$ | async"
              [currentUser]="currentUser$ | async"
              [isRecruiter]="isUserSupportAgent$ | async"
              [isThreadOwner]="isThreadOwner$ | async"
              [onlineOfflineStatuses$]="onlineOfflineStatuses$"
              [thread]="attributes.thread$ | async"
              [threadId$]="threadId$"
              [members]="members$ | async"
              [team]="team$ | async"
              [showAddPeopleOption]="showAddPeopleOption$ | async"
              (archiveChatToggle)="archiveChatToggle()"
              (blockChatToggle)="blockChatToggle()"
              (muteChatToggle)="muteChatToggle()"
              (userAdd)="popManagementModal()"
              (userRemove)="handleUserRemoved($event)"
            ></app-messaging-sidebar>
          </ng-template>
        </fl-drawer>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./chat-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatBoxComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  Margin = Margin;
  FontColor = FontColor;
  FontWeight = FontWeight;
  TextSize = TextSize;
  Overlay = Overlay;
  TextAlign = TextAlign;
  BannerAlertType = BannerAlertType;
  ChatOperation = ChatOperation;
  ChatOperationError = ChatOperationError;
  Feature = Feature;
  StickyBehaviour = StickyBehaviour;
  StickyPosition = StickyPosition;

  @Input() attributes: ChatAttributes;
  @Input() inCall$: Rx.Observable<boolean>;
  @Input() allContacts$: Rx.Observable<ReadonlyArray<Contact>>;
  @Input() currentUserIdValue: string;
  @Input() team$: Rx.Observable<Team>;

  @Output() closeChat = new EventEmitter<ThreadIdentifier>();
  @Output() minimiseChat = new EventEmitter<ThreadIdentifier>();
  @Output() makingCall = new EventEmitter<boolean>();
  // FIXME Subjects should not be outputs T69850
  @Output() emojiPickedSubject$ = new Rx.Subject<string>();
  @Output() focusClick = new EventEmitter<ThreadIdentifier>();

  @HostBinding('class.IsChatboxMode')
  @Input()
  chatBoxMode = true;

  @HostBinding('class.IsMinimised') isMinimised = false;
  @ViewChild('typingBox') typingBox: TypingBoxComponent;
  @ViewChild('onboardingOverlay')
  onboardingOverlay: OnboardingOverlayComponent;
  @ViewChild('chatOptionsDrawer')
  chatOptionsDrawer: DrawerComponent;

  threadIdentifierKey: string;
  allChatMembers$: Rx.Observable<ReadonlyArray<User>>;
  agentSession$: Rx.Observable<AgentSession>;
  bidders$: Rx.Observable<ReadonlyArray<User>>;
  userAwardedBidCollection?: DatastoreCollection<BidsCollection>;
  callsEnabled$: Rx.Observable<CallEnabledState>;
  candidatesExist$: Rx.Observable<boolean>;
  collaborators$: Rx.Observable<ReadonlyArray<User>>;
  contacts$: Rx.Observable<ReadonlyArray<Contact>>;
  contestDoc: DatastoreDocument<ContestsCollection>;
  contextBoxState$: Rx.Observable<ContextBoxState>;
  currentUser$: Rx.Observable<User>;
  currentUserId$: Rx.Observable<string>;
  error?: { code: string; operation: string };
  activeOverlay?: Overlay;
  hourlyContracts$: Rx.Observable<ReadonlyArray<HourlyContract>>;
  isThreadOwner$: Rx.Observable<boolean>;
  isUserSupportAgent$: Rx.Observable<boolean>;
  usersTyping: UsersTypingMap = {};
  typingSubscription?: Rx.Subscription;
  fileUploadEnabled$: Rx.Observable<boolean>;
  lastSentTyping = 0;
  members$: Rx.Observable<ReadonlyArray<User>>;
  supportAgentMembers$: Rx.Observable<ReadonlyArray<Agent>>;
  messagesCollection: DatastoreCollection<MessagesCollection>;
  nonGroupChat$: Rx.Observable<boolean>;
  onlineOffline$: Rx.Observable<boolean>;
  otherMembers$: Rx.Observable<ReadonlyArray<User>>;
  projectDoc: DatastoreDocument<ThreadProjectsCollection>;
  showOnboardingOverlay$: Rx.Observable<Boolean>;
  private projectOverlayClosedSubject$ = new Rx.BehaviorSubject<Boolean>(false);
  sortedMessages$: Rx.Observable<ReadonlyArray<Message>>;
  stateManager: StateManager;
  validProjectForCall$: Rx.Observable<boolean>;
  otherUser$: Rx.Observable<number>;
  threadId$: Rx.Observable<number>;
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;
  fileUploadSession: FileUploadSession;
  files$: Rx.Observable<ReadonlyArray<File>>;
  uploads$: Rx.Observable<ReadonlyArray<UploadStatus>>;
  messageSendQueue: ReadonlyArray<Message> = [];
  isGroupChatThread$: Rx.Observable<boolean>;
  isDeloitteUser$: Rx.Observable<boolean>;
  failedInvoicesBlockingMilestoneCreation$: Rx.Observable<boolean>;
  readonly messageSendQueueSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<Message>
  >([]);
  readonly messageSend$ = this.messageSendQueueSubject$
    .asObservable()
    .pipe(publishReplay(1), refCount());
  messageErrorQueue: ReadonlyArray<Message> = [];
  readonly messageErrorQueueSubject$ = new Rx.BehaviorSubject<
    ReadonlyArray<Message>
  >([]);
  readonly messageError$ = this.messageErrorQueueSubject$
    .asObservable()
    .pipe(publishReplay(1), refCount());
  autochatTracking?: Rx.Subscription;
  threadCloseSubscription?: Rx.Subscription;

  // Properties for the load more logic
  readonly defaultLimit = 50;
  readonly limitIncreaseStep = 50;
  readonly maxLimit = 5000;
  currentLimit = this.defaultLimit;
  // flag to control spinner shown when user clicks on "load more..." to load more messages
  messagesLoadingMore$: Rx.Observable<boolean>;
  private messagesLimitSubject$ = new Rx.BehaviorSubject<number>(
    this.defaultLimit,
  );
  canLoadMore$: Rx.Observable<boolean>;
  showAddPeopleOption$: Rx.Observable<boolean>;

  private readonly XXX_SKILL_ID = 88;
  private messageAttachmentsSubscription?: Rx.Subscription;
  messageAttachments: ReadonlyArray<File>;
  // TODO: remove once we release thumbnail support to all users (T88919)
  useThumbnailService$: Rx.Observable<boolean>;

  constructor(
    private datastore: Datastore,
    private auth: Auth,
    private abtestService: ABTest,
    private fileUpload: FileUploadLegacy,
    private webSocketService: WebSocketService,
    private tracking: Tracking,
    private modalService: ModalService,
    private timeUtils: TimeUtils,
    private userAgent: UserAgent,
    private featureFlagService: FeatureFlagsService,
    private localStorage: LocalStorage,
    @Optional() private messagingInboxComponent: MessagingInboxComponent,
  ) {}

  ngOnInit() {
    this.fileUploadEnabled$ = this.featureFlagService.getFlag(
      Feature.FILEUPLOAD,
    );

    this.threadIdentifierKey = getThreadIdentifierKey(
      this.attributes.threadIdentifier,
    );

    this.currentUserId$ = this.auth.getUserId();

    this.threadId$ = this.attributes.thread$.pipe(
      map(thread => thread.id),
      distinctUntilChanged(),
    );

    this.isGroupChatThread$ = this.attributes.thread$.pipe(
      map(
        thread =>
          thread.threadType === ThreadTypeApi.GROUP ||
          thread.threadType === ThreadTypeApi.TEAM,
      ),
    );

    this.useThumbnailService$ = this.currentUserId$.pipe(
      map(
        userId =>
          this.abtestService.isWhitelistUser() ||
          this.abtestService.shouldEnrol(
            'T90189-image-thumbnail-service',
            userId,
            0.01,
          ),
      ),
    );

    this.threadCloseSubscription = Rx.combineLatest([
      this.attributes.threadCollection.valueChanges(),
      this.attributes.thread$,
    ]).subscribe(([threadCollection, thread]) => {
      // Thread collection attribute has only single thread for each chat box.
      // When thread owner abandons a group chat, close the chat box for other members since thread will be nonexistent.
      if (threadCollection.length === 0 && !thread.isFake) {
        this.close();
      }
    });

    this.fileUploadSession = this.fileUpload.createSession();
    this.files$ = this.fileUploadSession.files$;
    this.uploads$ = this.fileUploadSession.uploads$;

    this.messageAttachmentsSubscription = this.files$.subscribe(
      f => (this.messageAttachments = f),
    );

    this.allChatMembers$ = this.datastore
      .collection<UsersCollection>(
        'users',
        this.attributes.thread$.pipe(
          map(t => [
            ...t.inactiveMembers.map(u => u.toString()),
            ...t.members.map(u => u.toString()),
          ]),
        ),
      )
      .valueChanges()
      .pipe(publishReplay(1), refCount(), startWithEmptyList());

    this.onlineOfflineStatuses$ = this.datastore
      .collection<OnlineOfflineCollection>(
        'onlineOffline',
        this.attributes.thread$.pipe(map(t => t.members)),
      )
      .valueChanges();

    this.members$ = Rx.combineLatest([
      this.allChatMembers$,
      this.attributes.thread$,
    ]).pipe(
      map(([allMembers, thread]) =>
        allMembers.filter(m => thread.members.includes(m.id)),
      ),
    );

    this.nonGroupChat$ = this.members$.pipe(map(ms => ms.length === 2));

    this.currentUser$ = Rx.combineLatest([
      this.members$,
      this.currentUserId$,
    ]).pipe(
      map(([members, currentUserId]) =>
        members.find(m => m.id === toNumber(currentUserId)),
      ),
      filter(isDefined),
    );

    this.otherMembers$ = Rx.combineLatest([
      this.members$,
      this.currentUserId$,
    ]).pipe(
      map(([members, currentUserId]) =>
        members.filter(m => m.id !== toNumber(currentUserId)),
      ),
    );

    this.otherUser$ = this.otherMembers$.pipe(
      map(otherMembers => otherMembers[0]),
      filter(isDefined),
      map(otherMembers => otherMembers.id),
    );

    this.onlineOffline$ = this.datastore
      .document<OnlineOfflineCollection>('onlineOffline', this.otherUser$)
      .valueChanges()
      .pipe(map(e => e.status === OnlineOfflineUserStatusValue.ONLINE));

    this.isThreadOwner$ = Rx.combineLatest([
      this.attributes.thread$,
      this.currentUserId$,
    ]).pipe(
      map(
        ([thread, currentUserId]) =>
          !thread.isFake && thread.owner === toNumber(currentUserId),
      ),
    );

    this.agentSession$ = this.datastore
      .collection<AgentSessionsCollection>('agentSessions', query =>
        query.where(
          'sessionId',
          '==',
          this.attributes.thread$.pipe(
            map(({ context }) => context),
            map(context =>
              context && context.type === ContextTypeApi.SUPPORT_SESSION
                ? context.id
                : undefined,
            ),
            filter(isDefined),
          ),
        ),
      )
      .valueChanges()
      .pipe(
        map(sessions => sessions[0]),
        // There should be a session here however there is an issue with the
        // agent session API which wont return sessions that you don't own.
        // See: https://phabricator.tools.flnltd.com/T76418
        filter(isDefined),
      );

    // A user can have multiple agents, e.g. Recruiter & Success Manager.
    this.supportAgentMembers$ = this.datastore
      .collection<AgentsCollection>('agents', query =>
        query
          .where(
            'userId',
            'in',
            this.members$.pipe(map(users => users.map(user => user.id))),
          )
          .where('state', 'in', [
            // exclude disabled agent state
            AgentStateApi.AVAILABLE,
            AgentStateApi.AWAY,
            AgentStateApi.UNAVAILABLE,
          ]),
      )
      .valueChanges();

    this.isUserSupportAgent$ = Rx.combineLatest([
      this.currentUserId$.pipe(map(toNumber), filter(isDefined)),
      this.supportAgentMembers$,
    ]).pipe(
      map(([currentUserId, agents]) =>
        agents.some(agent => agent.userId === currentUserId),
      ),
    );

    this.messagesCollection = this.datastore.collection<MessagesCollection>(
      'messages',
      query =>
        this.attributes.thread$.pipe(
          tap(() => {
            // reset the limit
            this.currentLimit = this.defaultLimit;
            this.messagesLimitSubject$.next(this.currentLimit);
          }),
          filter(thread => !thread.isFake && thread.id > 0),
          map(thread => thread.id),
          distinctUntilChanged(),
          map(threadId =>
            query
              .where('threadId', '==', threadId)
              .limit(this.messagesLimitSubject$.asObservable()),
          ),
        ),
    );

    this.messagesLoadingMore$ = this.messagesCollection.status$.pipe(
      map(status => !status.ready),
    );

    this.canLoadMore$ = this.messagesCollection
      .valueChanges()
      .pipe(
        map(
          messages =>
            this.currentLimit < this.maxLimit &&
            messages.length >= this.currentLimit,
        ),
      );

    this.sortedMessages$ = Rx.combineLatest([
      Rx.combineLatest([
        this.messagesCollection.valueChanges(),
        this.messageError$,
        this.threadId$,
      ]).pipe(
        map(([ms, failed, threadId]) => {
          const threadFailedMessages = failed.filter(
            f => f.threadId === threadId,
          );

          const sortedMessagesClientIdSet = new Set(
            ms.map(m => m.clientMessageId),
          );
          const [failedDup, failedUnique] = partition(threadFailedMessages, m =>
            sortedMessagesClientIdSet.has(m.clientMessageId),
          );

          // This check is essential to prevent an infinite emit loop
          if (failedDup.length > 0) {
            this.messageErrorQueue = [...failedUnique];
            this.messageErrorQueueSubject$.next(this.messageErrorQueue);
          }
          const sms = [...ms, ...failedUnique].sort((a, b) => {
            if (a.timeCreated === b.timeCreated) {
              return a.id - b.id;
            }
            return a.timeCreated - b.timeCreated;
          });

          // Mark rich message duplicates (same category field).
          const seen: { [index: string]: boolean } = {};
          return sms.reduceRight((acc, msg) => {
            const message = JSON.parse(JSON.stringify(msg));
            if (message.richMessage) {
              if (seen[message.richMessage.category]) {
                message.richMessage.disabled = true;
              }
              seen[message.richMessage.category] = true;
            }
            return [message, ...acc];
          }, [] as Message[]);
        }),
      ),

      this.messageSend$,
    ]).pipe(
      map(([sortedMessages, queuedMessages]) => {
        const sortedMessagesClientIdSet = new Set(
          sortedMessages.map(m => m.clientMessageId),
        );
        const filteredQueuedMessages = queuedMessages.filter(
          m => !sortedMessagesClientIdSet.has(m.clientMessageId),
        );
        return sortedMessages.concat(filteredQueuedMessages);
      }),
    );

    this.typingSubscription = this.webSocketService.fromServerStream$
      .pipe(
        filter(isWebsocketMessage),
        withLatestFrom(this.threadId$),
        filter(
          ([evt, threadId]) =>
            evt.body.parent_type === 'messages' &&
            evt.body.type === 'typing' &&
            evt.body.data.thread === threadId,
        ),
      )
      .subscribe(([evt, _]) => {
        this.usersTyping[evt.body.data.from_user] = Rx.combineLatest([
          this.timeUtils.rxTimer(5000).pipe(mapTo(false), startWith(true)),
          this.sortedMessages$.pipe(
            map(messages =>
              messages.filter(
                message => message.sendStatus === MessageSendStatus.SENT,
              ),
            ),
          ),
          this.attributes.thread$.pipe(map(thread => thread.userReadTimes)),
        ]).pipe(
          map(([isTyping, sentMessages, userReadTimes]) => {
            const user = evt.body.data.from_user;
            const lastSentMessage = sentMessages.pop();

            return (
              isTyping &&
              !!lastSentMessage &&
              userReadTimes[user] >= lastSentMessage.timeCreated &&
              (lastSentMessage.fromUser !== user ||
                evt.body.timestamp * 1000 > lastSentMessage.timeCreated)
            );
          }),
        );
      });

    this.autochatTracking = this.sortedMessages$.subscribe(messages => {
      // send autochat QTS event (for the employer/recipient only)
      const message = messages[messages.length - 1];
      if (
        message &&
        // normal autochat
        (message.messageSource === 'autochat' ||
          // T74749 autochat rich messages
          (message.richMessage &&
            message.richMessage.category &&
            message.richMessage.category.startsWith('AUTOCHAT'))) &&
        this.attributes.threadIdentifier.context.type === 'project' &&
        message.fromUser !== toNumber(this.currentUserIdValue)
      ) {
        this.tracking.track('user_action', {
          reference: 'project_id',
          reference_id: this.attributes.threadIdentifier.context.id,
          section: 'ProjectViewPage',
          subsection: 'AutoChat',
          label: 'ShowChatBox',
          name: 'user_id',
          value: message.fromUser,
        });
      }
    });

    this.contacts$ = Rx.combineLatest([
      this.allContacts$,
      this.attributes.thread$,
    ]).pipe(
      map(([users, thread]) =>
        users.filter(user => !thread.members.includes(user.id)),
      ),
    );

    this.isDeloitteUser$ = this.datastore
      .document<UsersCollection>('users', this.auth.getUserId())
      .valueChanges()
      .pipe(map(user => !!user.isDeloitteDcUser));

    const projectId$ = Rx.merge(
      this.attributes.thread$.pipe(
        map(({ context }) => context),
        map(context =>
          context && context.type === ContextTypeApi.PROJECT
            ? context.id
            : undefined,
        ),
        filter(isDefined),
      ),
      this.agentSession$.pipe(
        // Project from agent session with source type `project`
        filter(
          agentSession =>
            agentSession.sessionSourceType === SessionSourceType.PROJECT,
        ),
        map(agentSession => agentSession.sessionSourceId),
      ),
    );

    this.projectDoc = this.datastore.document<ThreadProjectsCollection>(
      'threadProjects',
      projectId$,
    );

    const bidderId$: Rx.Observable<number> = Rx.combineLatest([
      this.projectDoc
        .valueChanges()
        .pipe(map(threadProject => threadProject.ownerId)),
      this.otherUser$,
      this.currentUser$.pipe(map(currentUser => toNumber(currentUser.id))),
    ]).pipe(
      map(([ownerId, otherUser, currentUser]) =>
        ownerId === currentUser ? otherUser : currentUser,
      ),
      distinctUntilChanged(),
    );

    this.userAwardedBidCollection = this.datastore.collection<BidsCollection>(
      'bids',
      query =>
        query
          .where('projectId', '==', projectId$)
          .where('awardStatus', '==', BidAwardStatusApi.AWARDED)
          .where('bidderId', '==', bidderId$),
    );

    this.contestDoc = this.datastore.document<ContestsCollection>(
      'contests',
      this.attributes.thread$.pipe(
        map(({ context }) => context),
        filter(isDefined),
        filter(context => context.type === 'contest'),
        map(context => (context.type === 'contest' && context.id) || undefined),
        filter(isDefined),
      ),
    );

    const threadBidsCollection = this.datastore.collection<BidsCollection>(
      'bids',
      query =>
        query.where(
          'projectId',
          '==',
          this.projectDoc.valueChanges().pipe(map(project => project.id)),
        ),
    );

    const threadBidUsers$ = Rx.combineLatest([
      threadBidsCollection.valueChanges(),
      this.attributes.thread$,
    ]).pipe(
      map(([bids, thread]) =>
        bids
          .map(bid => bid.bidderId)
          .filter(u => !thread.members.includes(u))
          .filter(u => u !== undefined),
      ),
      filter(users => users.length > 0),
    );

    const milestonesCollection = this.datastore.collection<
      MilestonesCollection
    >('milestones', query =>
      Rx.combineLatest([
        this.projectDoc.valueChanges(),
        this.currentUserId$,
      ]).pipe(
        map(([project, currentUserId]) =>
          project.ownerId === toNumber(currentUserId)
            ? query.where('projectId', '==', projectId$)
            : query
                .where('projectId', '==', projectId$)
                .where('bidderId', '==', toNumber(currentUserId)),
        ),
      ),
    );

    const milestoneRequestsCollection = this.datastore.collection<
      MilestoneRequestsCollection
    >('milestoneRequests', query =>
      Rx.combineLatest([
        this.projectDoc.valueChanges(),
        this.currentUserId$,
      ]).pipe(
        map(([project, currentUserId]) =>
          project.ownerId === toNumber(currentUserId)
            ? query.where('projectId', '==', projectId$)
            : query
                .where('projectId', '==', projectId$)
                .where('bidderId', '==', toNumber(currentUserId)),
        ),
      ),
    );

    const hourlyContractsCollection = this.datastore.collection<
      HourlyContractsCollection
    >('hourlyContracts', query =>
      query
        .where(
          'projectId',
          '==',
          this.projectDoc.valueChanges().pipe(
            filter(isDefined),
            filter(project => project.type === ProjectTypeApi.HOURLY),
            map(p => p.id),
          ),
        )
        .where('bidderId', '==', bidderId$),
    );

    this.hourlyContracts$ = hourlyContractsCollection.valueChanges();

    const userBidCollection = this.datastore.collection<BidsCollection>(
      'bids',
      query =>
        query
          .where('projectId', '==', projectId$)
          .where('bidderId', '==', bidderId$),
    );

    const unlinkedInvoiceCollection = this.datastore.collection<
      InvoicesCollection
    >('invoices', query =>
      query
        .where('projectId', '==', projectId$)
        .where('freelancerId', '==', bidderId$)
        .where(
          'milestoneLinkedStatus',
          '==',
          ProjectInvoiceMilestoneLinkedStatusesApi.UNLINKED,
        )
        .limit(1),
    );

    this.stateManager = new StateManager(
      this.auth,
      this.attributes.thread$,
      this.members$,
      this.projectDoc.valueChanges(),
      this.contestDoc.valueChanges(),
      userBidCollection.valueChanges(),
      milestonesCollection.valueChanges(),
      milestoneRequestsCollection.valueChanges(),
      this.hourlyContracts$,
      this.agentSession$,
      this.team$,
      unlinkedInvoiceCollection.valueChanges(),
    );
    this.contextBoxState$ = this.stateManager.getState();

    this.bidders$ = this.datastore
      .collection<UsersCollection>('users', threadBidUsers$)
      .valueChanges()
      .pipe(publishReplay(1), refCount(), startWithEmptyList());

    const collaboratorUserIds$ = Rx.combineLatest([
      this.projectDoc.valueChanges(),
      this.attributes.thread$,
    ]).pipe(
      map(([project, thread]) =>
        (project.projectCollaborations || [])
          .map(c => c.userId || -1)
          .filter(uId => uId > 0 && !thread.members.includes(uId)),
      ),
      filter(users => users.length > 0),
    );

    this.collaborators$ = this.datastore
      .collection<UsersCollection>('users', collaboratorUserIds$)
      .valueChanges()
      .pipe(publishReplay(1), refCount(), startWithEmptyList());

    const awardAccepted$ = this.userAwardedBidCollection.valueChanges().pipe(
      map(userAwardedBids => userAwardedBids.length > 0),
      startWith(false),
    );

    // disable calls for projects having XXX skills
    const isProjectEligible$ = this.projectDoc.valueChanges().pipe(
      map(p => !p.skills.map(j => j.id).includes(this.XXX_SKILL_ID)),
      startWith(false),
    );

    this.callsEnabled$ = combineLatestExtended([
      awardAccepted$,
      this.nonGroupChat$,
      this.onlineOffline$,
      this.inCall$,
      this.isUserSupportAgent$,
      this.attributes.thread$,
      isProjectEligible$,
    ]).pipe(
      map(
        ([
          isValidProject,
          isNonGroupChat,
          isOnline,
          isInCall,
          isSupportUser,
          thread,
          isProjectEligible,
        ]) => {
          let reason = '';
          if (!isNonGroupChat) {
            reason = 'Private chats only';
          } else if (isSupportUser) {
            // recruiter bypasses the checks below so calls are enabled
            // on their threads except group chat threads, we're resetting
            // this variable so we'll show the proper tooltip for enabled call icons
            reason = '';
          } else if (thread.writePrivacy === 'none') {
            reason = 'Thread is blocked';
          } else if (!isValidProject) {
            reason = 'Awarded and accepted projects only';
          } else if (!isOnline) {
            reason = 'The user is offline';
          } else if (!this.isCallSupportedBrowser()) {
            reason = 'Your browser is unsupported';
          } else if (isInCall) {
            reason = 'Already in a call';
          } else if (!isProjectEligible) {
            reason = 'Not allowed for this project';
          }

          const baseConds =
            isValidProject &&
            isNonGroupChat &&
            isOnline &&
            this.isCallSupportedBrowser() &&
            !isInCall &&
            thread.writePrivacy !== 'none' &&
            isProjectEligible;
          return {
            audio:
              (isSupportUser && isNonGroupChat) ||
              ((thread.threadType === 'admin_preferred_chat' ||
                !isSupportUser) &&
                baseConds),
            video:
              (isSupportUser && isNonGroupChat) ||
              (!isSupportUser &&
                thread.threadType !== 'admin_preferred_chat' &&
                baseConds),
            reason,
          };
        },
      ),
      startWith({
        audio: false,
        video: false,
      }),
      publishReplay(1),
      refCount(),
    );

    this.candidatesExist$ = Rx.combineLatest([
      this.contacts$,
      this.collaborators$,
      this.bidders$,
    ]).pipe(
      map(candidates =>
        candidates.some(candidateGroup => candidateGroup.length > 0),
      ),
    );

    // overlay only for freelancers that have bid
    this.showOnboardingOverlay$ = Rx.combineLatest([
      this.projectOverlayClosedSubject$,
      threadBidsCollection.valueChanges(),
      this.currentUserId$,
      this.attributes.thread$,
      this.localStorage.get('projectOverlayThreadComplete'),
      this.isDeloitteUser$,
    ]).pipe(
      map(
        ([closed, bids, userId, thread, overlay, deloitteUser]) =>
          this.chatBoxMode &&
          !closed &&
          thread.context.type === 'project' &&
          thread.threadType === 'private_chat' &&
          !(overlay && overlay[thread.id]) &&
          bids.find(bid => bid.bidderId === toNumber(userId)) !== undefined &&
          !deloitteUser,
      ),
    );

    this.showAddPeopleOption$ = Rx.combineLatest([
      this.attributes.thread$,
      this.team$.pipe(startWith(undefined)),
      this.isThreadOwner$,
      this.isUserSupportAgent$,
      this.candidatesExist$,
    ]).pipe(
      map(([thread, team, isThreadOwner, isSupportUser, candidatesExist]) => {
        // Non-contextual threads cannot create group chat
        if (thread.context.type === ContextTypeApi.NONE) {
          return false;
        }

        if (
          (thread.context.type === ContextTypeApi.TEAM &&
            thread.threadType !== ThreadTypeApi.TEAM_OFFICIAL) ||
          (thread.threadType === ThreadTypeApi.TEAM && team)
        ) {
          return true;
        }

        if (thread.threadType === ThreadTypeApi.TEAM_OFFICIAL) {
          return false;
        }

        return (isThreadOwner && candidatesExist) || isSupportUser;
      }),
    );
  }

  ngOnDestroy() {
    if (this.autochatTracking) {
      this.autochatTracking.unsubscribe();
    }
    if (this.threadCloseSubscription) {
      this.threadCloseSubscription.unsubscribe();
    }
    if (this.messageAttachmentsSubscription) {
      this.messageAttachmentsSubscription.unsubscribe();
    }
    if (this.typingSubscription) {
      this.typingSubscription.unsubscribe();
    }
  }

  @HostListener('click')
  onClick() {
    this.focusChatbox();

    if (!this.onboardingOverlay) {
      this.markAsRead();
    }
  }

  @HostListener('document:keyup', ['$event'])
  escCloseChat(e: KeyboardEvent) {
    if (
      e.key === 'Escape' &&
      (this.attributes.focus === FocusState.Header ||
        this.attributes.focus === FocusState.HeaderAndTypingBox)
    ) {
      setTimeout(() => this.close());
    }
  }

  passMakingCallState(state: boolean) {
    this.makingCall.emit(state);
  }

  closeOnboardingOverlay() {
    this.projectOverlayClosedSubject$.next(true);
  }

  toggleMinimised() {
    this.minimiseChat.emit(this.attributes.threadIdentifier);
  }

  ngAfterViewInit() {
    if (this.attributes.focus) {
      // Only focus the typing box to avoid a double change detection error.
      this.focusTypingBox();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('attributes' in changes) {
      this.isMinimised = changes.attributes.currentValue.minimised;

      // Mark thread as read when opened in inbox or chatbox
      if (
        this.attributes?.focus !== FocusState.Neither &&
        ((this.chatBoxMode &&
          changes.attributes.previousValue?.focus !==
            changes.attributes.currentValue.focus) ||
          (!this.chatBoxMode &&
            changes.attributes.previousValue?.threadIdentifier !==
              changes.attributes.currentValue.threadIdentifier))
      ) {
        this.markAsRead();
      }

      // clear error message when switching threads on inbox
      if (!this.chatBoxMode) {
        this.clearThreadError();
      }

      if (
        !changes.attributes.previousValue ||
        !changes.attributes.previousValue.threadIdentifier ||
        changes.attributes.previousValue.threadIdentifier !==
          changes.attributes.currentValue.threadIdentifier
      ) {
        this.threadIdentifierKey = getThreadIdentifierKey(
          changes.attributes.currentValue.threadIdentifier,
        );
      }
    }
  }

  handleMessageResend(message: Message) {
    const messageIndex = this.messageErrorQueue.findIndex(
      m => m.clientMessageId === message.clientMessageId,
    );
    if (messageIndex >= 0) {
      this.messageErrorQueue = [
        ...this.messageErrorQueue.slice(0, messageIndex),
        ...this.messageErrorQueue.slice(messageIndex + 1),
      ];
      this.messageErrorQueueSubject$.next(this.messageErrorQueue);
      this.enqueueMessage(message.message);
    }
  }

  enqueueMessage(message: string) {
    const clientMessageId = Date.now();
    const isFakeThread = this.attributes.threadIdentifier.isFake;
    const isMessageEmpty = message === undefined || message.trim().length === 0;

    if (!isFakeThread) {
      const threadId = this.attributes.threadIdentifier.id.toString();
      this.fileUploadSession.send({
        endpoint: `messages/0.1/threads/${threadId}/messages/`,
        extraParams: {
          thread_id: threadId,
          client_message_id: clientMessageId.toString(),
        },
      });
    }

    if (isFakeThread && isMessageEmpty && this.messageAttachments.length > 0) {
      this.error = {
        code: ChatOperationError.MESSAGE_REQUIRED,
        operation: ChatOperation.SEND_MESSAGE,
      };
      return;
    }

    if (isMessageEmpty) {
      return;
    }

    this.messageSendQueue = [
      ...this.messageSendQueue,
      {
        attachments: [],
        clientMessageId,
        fromUser: toNumber(this.currentUserIdValue),
        id: clientMessageId,
        message,
        messageSource: MessageSourceType.CHAT_BOX,
        threadId: this.attributes.threadIdentifier.id,
        timeCreated: Date.now(),
        sendStatus: MessageSendStatus.SENDING,
      },
    ];
    this.messageSendQueueSubject$.next(this.messageSendQueue);
    if (this.messageSendQueue.length === 1) {
      this.sendQueuedMessage();
    }
  }

  sendQueuedMessage() {
    if (this.messageSendQueue.length === 0) {
      return;
    }
    const message = this.messageSendQueue[0];
    this.messageSendQueueSubject$.next(this.messageSendQueue);
    this.sendMessage(message)
      .then(() => {
        this.messageSendQueue = this.messageSendQueue.slice(1);
        this.messageSendQueueSubject$.next(this.messageSendQueue);
        this.sendQueuedMessage();
      })
      .catch(e => {
        this.messageErrorQueue = [
          ...this.messageErrorQueue,
          {
            ...message,
            timeCreated: Date.now(), // need this to maintain sorted order
            sendStatus: MessageSendStatus.FAILED,
          },
        ];
        this.messageErrorQueueSubject$.next(this.messageErrorQueue);
        this.messageSendQueue = this.messageSendQueue.slice(1);
        this.messageSendQueueSubject$.next(this.messageSendQueue);
        this.sendQueuedMessage();
      });
  }

  sendMessage(m: Message) {
    return Rx.of(m)
      .pipe(
        withLatestFrom(this.auth.getUserId(), this.attributes.thread$),
        flatMap(([message, fromUser, thread]) => {
          if (!thread.isFake) {
            return this.messagesCollection.push(message).then(result => {
              if (result.status !== 'success') {
                this.error = {
                  code: result.errorCode,
                  operation: 'send-message',
                };
                throw new Error(result.errorCode);
              }

              if (this.error) {
                this.clearThreadError();
              }
              return undefined;
            });
          }
          const body = createThreadBody(
            thread,
            message.message,
            toNumber(fromUser),
          );
          return this.attributes.threadCollection
            .push(body)
            .then(result => {
              if (result.status !== 'success') {
                this.error = {
                  code: result.errorCode,
                  operation: 'send-message',
                };
                throw new Error(result.errorCode);
              }

              if (this.error) {
                this.clearThreadError();
              }

              return result.id;
            })
            .then(threadId => {
              // send files to the thread
              this.fileUploadSession.send({
                endpoint: `messages/0.1/threads/${threadId}/messages/`,
                extraParams: {
                  thread_id: threadId.toString(),
                  client_message_id: Date.now().toString(),
                },
              });
            });
        }),
      )
      .toPromise();
  }

  focusChatbox() {
    this.focusClick.emit(this.attributes.threadIdentifier);
    this.focusTypingBox();
  }

  focusTypingBox() {
    if (
      !this.isMinimised &&
      this.typingBox &&
      (this.attributes.focus === FocusState.Header ||
        this.attributes.focus === FocusState.HeaderAndTypingBox)
    ) {
      this.typingBox.focus();
    }
  }

  close() {
    this.closeChat.emit(this.attributes.threadIdentifier);
  }

  toggleOverlay(overlay: Overlay) {
    if (overlay === Overlay.SETTINGS && this.isMinimised) {
      this.toggleMinimised();
    }

    if (!this.chatBoxMode || this.activeOverlay === overlay) {
      this.activeOverlay = undefined;
    } else {
      this.activeOverlay = overlay;
    }
  }

  markAsRead() {
    Rx.of(this.attributes.threadIdentifier.isFake)
      .pipe(
        withLatestFrom(this.attributes.thread$),
        map(([isFake, thread]) => {
          if (isFake || (thread.isRead && thread.messageUnreadCount === 0)) {
            return false;
          }
          return this.attributes.threadCollection.update(thread.id, {
            isRead: true,
            messageUnreadCount: 0,
          });
        }),
      )
      .toPromise();
  }

  muteChatToggle() {
    Rx.of(this.attributes.threadIdentifier.isFake)
      .pipe(
        withLatestFrom(this.attributes.thread$),
        map(([isFake, thread]) => {
          if (isFake) {
            return false;
          }
          const isMuted = !thread.isMuted;
          return this.attributes.threadCollection
            .update(thread.id, {
              isMuted,
            })
            .then(result => {
              if (result.status !== 'success') {
                this.error = {
                  code: result.errorCode,
                  operation: 'mute-chat',
                };
              }
            });
        }),
      )
      .toPromise();
  }

  blockChatToggle() {
    Rx.of(this.attributes.threadIdentifier.isFake)
      .pipe(
        withLatestFrom(this.attributes.thread$),
        map(([isFake, thread]) => {
          if (isFake) {
            return false;
          }
          const isBlocked = !thread.isBlocked;
          return this.attributes.threadCollection
            .update(thread.id, {
              isBlocked,
            })
            .then(result => {
              if (result.status !== 'success') {
                this.error = {
                  code: result.errorCode,
                  operation: 'block-chat',
                };
              }
            });
        }),
      )
      .toPromise();
  }

  archiveChatToggle() {
    Rx.of(this.attributes.threadIdentifier.isFake)
      .pipe(
        withLatestFrom(this.attributes.thread$),
        map(([isFake, thread]) => {
          if (isFake) {
            return false;
          }
          const folder =
            thread.folder === FolderApi.INBOX
              ? FolderApi.ARCHIVED
              : FolderApi.INBOX;
          return this.attributes.threadCollection
            .update(thread.id, {
              folder,
            })
            .then(result => {
              if (result.status !== 'success') {
                this.error = {
                  code: result.errorCode,
                  operation: 'archive-chat',
                };
              }
            });
        }),
      )
      .toPromise();
  }

  handleTypingEvent(text: string) {
    this.markAsRead();
    if (
      !this.attributes.threadIdentifier.isFake &&
      Date.now() > this.lastSentTyping + 5000
    ) {
      this.lastSentTyping = Date.now();
      this.attributes.threadCollection.update(
        this.attributes.threadIdentifier.id,
        {
          typing: true,
        },
      );
    }
    if (!this.threadIdentifierKey) {
      return;
    }
    if (text && text.length > 0) {
      this.saveDraftMessage(this.threadIdentifierKey, text);
    } else {
      this.clearDraftMessage(this.threadIdentifierKey);
    }
  }

  clearThreadError() {
    this.error = undefined;
  }

  modifyMembers(e: {
    action: 'add' | 'remove';
    userIds: ReadonlyArray<number>;
  }) {
    Rx.of(e)
      .pipe(
        withLatestFrom(this.attributes.thread$, this.currentUserId$),
        map(([modifyEvent, thread, currentUserId]) => {
          if (thread.isFake) {
            return;
          }
          const members =
            modifyEvent.action === 'add'
              ? [...thread.members, ...modifyEvent.userIds]
              : thread.members.filter(m => !modifyEvent.userIds.includes(m));

          const otherMembers = members.filter(
            m => m !== toNumber(currentUserId),
          );

          const inactiveMembers =
            modifyEvent.action === 'add'
              ? thread.inactiveMembers.filter(
                  m => !modifyEvent.userIds.includes(m),
                )
              : [...thread.inactiveMembers, ...modifyEvent.userIds];

          return this.attributes.threadCollection
            .update(thread.id, {
              inactiveMembers,
              members,
              otherMembers,
            })
            .then(result => {
              if (result.status === 'success') {
                if (
                  e.action === 'remove' &&
                  e.userIds.includes(toNumber(currentUserId))
                ) {
                  this.close();
                }
              }
            });
        }),
      )
      .toPromise();
  }

  handleUserRemoved(user: User) {
    this.modifyMembers({
      action: 'remove',
      userIds: [user.id],
    });
  }

  popManagementModal() {
    this.modalService
      .open(GroupchatManagementModalComponent, {
        inputs: {
          bidders$: this.bidders$,
          contacts$: this.contacts$,
          collaborators$: this.collaborators$,
          onlineOfflineStatuses$: this.onlineOfflineStatuses$,
          isRecruiter$: this.isUserSupportAgent$,
          thread$: this.attributes.thread$,
          team$: this.team$,
        },
        size: ModalSize.SMALL,
      })
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result && result instanceof Array && result.length > 0) {
          this.modifyMembers({
            action: 'add',
            userIds: result,
          });
        }
      });
  }

  isCallSupportedBrowser() {
    const ua = this.userAgent.getUserAgent();
    const { name } = ua.getBrowser();
    return name === 'Chrome' || name === 'Firefox';
  }

  handleAddAttachment(file: File) {
    this.fileUploadSession.addFile(file);
    this.focusChatbox();
  }

  handleRemoveAttachment(file: File) {
    this.fileUploadSession.removeFile(file.name);
  }

  handleRemoveUpload(uploadId: string) {
    this.fileUploadSession.removeUpload(uploadId);
  }

  handleLoadMessages() {
    this.currentLimit = Math.min(
      this.currentLimit + this.limitIncreaseStep,
      this.maxLimit,
    );
    this.messagesLimitSubject$.next(this.currentLimit);
  }

  handleChatOptionsDrawerToggle(event: boolean) {
    if (event) {
      this.chatOptionsDrawer.open();
    } else {
      this.chatOptionsDrawer.close();
    }
  }

  isInboxPage(): boolean {
    return !this.chatBoxMode && !!this.messagingInboxComponent;
  }

  /* Draft Message Handling Functions (migration to local storage service) */
  saveDraftMessage(threadIdentifierKey: string, message: string) {
    const draftMessage: DraftMessage = {
      text: message,
      lastUpdated: Date.now(),
    };

    this.localStorage
      .get('webappChatDraftMessages')
      .pipe(take(1))
      .toPromise()
      .then((draftMessagesObject = {}) => {
        if (threadIdentifierKey) {
          const newDraftMessagesObject = {
            ...draftMessagesObject,
            [threadIdentifierKey]: draftMessage,
          };
          this.localStorage.set(
            'webappChatDraftMessages',
            newDraftMessagesObject,
          );
        }
      });
  }

  clearDraftMessage(threadIdentifierKey: string) {
    this.localStorage
      .get('webappChatDraftMessages')
      .pipe(take(1))
      .toPromise()
      .then(draftMessagesObject => {
        if (!draftMessagesObject) {
          return;
        }
        if (threadIdentifierKey) {
          const {
            [threadIdentifierKey]: deleteDraftMsg,
            ...remainingDraftMessages
          } = draftMessagesObject;
          this.localStorage.set(
            'webappChatDraftMessages',
            remainingDraftMessages,
          );
        }
      });
  }
}
