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
  Agent,
  AgentSession,
  Contest,
  OnlineOfflineUserStatus,
  Team,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';
import { FocusState } from '@freelancer/local-storage';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import {
  LinkColor,
  LinkHoverColor,
  LinkWeight,
  QueryParams,
} from '@freelancer/ui/link';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { CallType, Videochat } from '@freelancer/videochat';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { SupportTypeApi } from 'api-typings/support/support';
import { OnlineOfflineStatusApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import { CallEnabledState } from '../chat-box/chat-box.component';

@Component({
  selector: 'app-header',
  template: `
    <fl-bit class="ChatHeader-details">
      <fl-online-indicator
        class="ChatHeader-details-onlineStatus"
        *ngIf="!isGroupChat && !isTeamChat && otherUser"
        [username]="otherUser.username"
        [isOnline]="!!(otherUser | isOnline: (onlineOfflineStatuses$ | async))"
      ></fl-online-indicator>
      <fl-bit class="ChatHeader-details-text">
        <fl-link
          (click)="handleBlockedClick($event)"
          *ngIf="!isMinimised && titleLink !== undefined"
          class="ChatHeader-details-title"
          [color]="LinkColor.LIGHT"
          [weight]="LinkWeight.BOLD"
          [link]="titleLink"
          [queryParams]="titleParams"
          [hoverColor]="LinkHoverColor.LIGHT"
          flTrackingLabel="headerLink"
          [attr.data-uitest-target]="
            project ? 'chatbox-header-project-name' : 'chatbox-header-username'
          "
        >
          {{ title }}
        </fl-link>
        <fl-bit
          *ngIf="!isMinimised && titleLink === undefined"
          class="ChatHeader-details-title"
          [attr.data-uitest-target]="
            project ? 'chatbox-header-project-name' : 'chatbox-header-username'
          "
        >
          {{ title }}
        </fl-bit>
        <fl-bit
          *ngIf="isMinimised"
          class="ChatHeader-details-title"
          [attr.data-uitest-target]="
            project ? 'chatbox-header-project-name' : 'chatbox-header-username'
          "
        >
          {{ title }}
        </fl-bit>
        <fl-bit
          *ngIf="secondaryTitle !== undefined"
          class="ChatHeader-details-secondaryTitle"
          data-uitest-target="chatbox-header-username"
        >
          {{ secondaryTitle }}
        </fl-bit>
        <fl-relative-time
          *ngIf="
            showLastSeen &&
            otherUser &&
            otherUser.onlineOfflineStatus?.lastUpdatedTimestamp &&
            !(otherUser | isOnline: (onlineOfflineStatuses$ | async))
          "
          class="ChatHeader-details-secondaryTitle"
          [color]="FontColor.LIGHT"
          [size]="TextSize.XXXSMALL"
          [date]="lastSeenDate"
          [includeSeconds]="false"
          [strict]="true"
        ></fl-relative-time>
      </fl-bit>
    </fl-bit>
    <fl-bit class="ChatHeader-controls">
      <fl-tooltip
        *ngIf="!isMinimised && callsEnabled && callsEnabled.audio"
        class="ChatHeader-controls-btn"
        [position]="TooltipPosition.TOP_CENTER"
        [message]="
          (callsEnabled && callsEnabled.reason) || 'Start an audio call'
        "
      >
        <fl-button
          flTrackingLabel="audioCall"
          [attr.data-uitest-target]="'chatbox-audiochat-button'"
          (click)="handleAudioCallClick($event)"
        >
          <fl-icon
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
            [hoverColor]="HoverColor.PRIMARY"
            [name]="'ui-phone'"
          ></fl-icon>
        </fl-button>
      </fl-tooltip>

      <fl-tooltip
        *ngIf="
          !isMinimised &&
          callsEnabled &&
          callsEnabled.audio &&
          callsEnabled.video
        "
        class="ChatHeader-controls-btn"
        [position]="TooltipPosition.TOP_CENTER"
        [message]="
          (callsEnabled && callsEnabled.reason) || 'Start a video call'
        "
      >
        <fl-button
          flTrackingLabel="videoCall"
          [attr.data-uitest-target]="'chatbox-videochat-button'"
          (click)="handleVideoCallClick($event)"
        >
          <fl-icon
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
            [hoverColor]="HoverColor.PRIMARY"
            [name]="'ui-video-camera-v2'"
          ></fl-icon>
        </fl-button>
      </fl-tooltip>
      <fl-button
        flTrackingLabel="groupChat"
        *ngIf="
          !isMinimised &&
          (isUserSupportAgent ||
            isGroupChat ||
            isTeamChat ||
            (isThreadOwner && !isSupportChat))
        "
        class="ChatHeader-controls-btn"
        (click)="handleGroupchatButtonClick($event)"
      >
        <fl-icon
          *ngIf="canManageChatMembers()"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-invite-v2"
          i18n-label="Chatbox header icon label"
          label="Invite more users to this chat"
        ></fl-icon>
        <fl-icon
          *ngIf="!canManageChatMembers()"
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          name="ui-invite-v2"
          i18n-label="Chatbox header icon label"
          label="View the participants of this thread"
        ></fl-icon>
      </fl-button>
      <fl-button
        class="ChatHeader-controls-btn"
        flTrackingLabel="chatSettings"
        (click)="handleSettingsButtonClick($event)"
        data-uitest-target="chatbox-settings"
      >
        <fl-icon
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          [name]="'ui-cog-v2'"
          i18n-label="Chatbox header icon label"
          label="Chatbox settings"
        ></fl-icon>
      </fl-button>
      <fl-button
        class="ChatHeader-controls-btn"
        flTrackingLabel="closeChat"
        (click)="handleClose($event)"
        data-uitest-target="chatbox-close"
      >
        <fl-icon
          [color]="IconColor.LIGHT"
          [size]="IconSize.SMALL"
          [hoverColor]="HoverColor.PRIMARY"
          [name]="'ui-close'"
          i18n-label="Chatbox header icon label"
          label="Close chat"
        ></fl-icon>
      </fl-button>
    </fl-bit>
  `,
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnChanges {
  FontColor = FontColor;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkWeight = LinkWeight;
  TextSize = TextSize;
  TooltipPosition = TooltipPosition;

  @Input() thread: Thread;
  @Input() currentUserId: string;
  @Input() otherMembers: ReadonlyArray<User>;
  @Input() currentUser: User;
  @Input() project?: ThreadProject;
  @Input() contest?: Contest;
  @Input() agentSession?: AgentSession;
  @Input() isThreadOwner: boolean;
  @Input() candidatesExist: boolean;
  @Input() callsEnabled?: CallEnabledState;
  @Input() onlineOfflineStatuses$: Rx.Observable<
    ReadonlyArray<OnlineOfflineUserStatus>
  >;
  @Input() team: Team;
  @Input() focusState: FocusState = FocusState.Neither;
  @Input() supportAgentMembers: ReadonlyArray<Agent>;

  @HostBinding('class.IsMinimised')
  @Input()
  isMinimised: boolean;

  @HostBinding('class.IsUserRecruiter')
  @Input()
  isUserSupportAgent = false;

  @Output() closeChat = new EventEmitter();
  @Output() handleSettingsHeaderClick = new EventEmitter();
  @Output() handleGroupchatHeaderClick = new EventEmitter();
  @Output() makingCall = new EventEmitter<boolean>();

  @HostBinding('class.IsFocused') isFocused = false;
  @HostBinding('class.IsUnread') isUnread = false;
  @HostBinding('class.IsRecruiter') isSupportChat = false;
  @HostBinding('class.IsThreadSupportSession') isThreadSupportSession = false;
  @HostBinding('class.has-secondaryTitle') secondaryTitle?: string;
  @HostBinding('class.IsArrowProject') isArrowProject = false;

  title: string;
  titleLink?: string;
  titleParams?: QueryParams;

  // Agent associated with the support agent member of the thread.
  supportAgent?: Agent;

  // User of the thread that is a support agent.
  supportAgentUser?: User;

  isGroupChat: boolean;
  isTeamChat: boolean;
  threadHasContext = false;
  showLastSeen = false;
  lastSeenDate: Date;
  otherUser?: User;

  constructor(private videochat: Videochat) {}

  /**
   * Thread sub-title used for internal staff chats. I.e. this is not shown
   * to users.
   */
  private static getSupportQueueTitle(supportAgent: Agent): string {
    switch (supportAgent.type) {
      case SupportTypeApi.TECHNICAL:
        return 'Technical';
      case SupportTypeApi.RECRUITER:
        return 'Recruiter Chat';
      case SupportTypeApi.GENERAL:
        return 'General Chat';
      case SupportTypeApi.LOCAL:
        return 'Local Jobs';
      case SupportTypeApi.PAYMENT_SATISFACTION:
        return 'Payment Satisfaction';
      case SupportTypeApi.PROJECT_MANAGEMENT:
        return 'Project Management';
      case SupportTypeApi.SUCCESS_MANAGER:
        return 'Success Manager';
      case SupportTypeApi.MEMBERSHIP_CURATION:
        return 'Membership Curation';
      case SupportTypeApi.ARROW_CONCIERGE:
        return 'Arrow Concierge';
      default:
        // Convert underscore-case to start-case
        // E.g. pfp_tickets => Pfp Tickets
        return supportAgent.type
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }

  ngOnChanges() {
    [this.otherUser] = this.otherMembers;

    this.supportAgent = this.getSupportAgent(
      this.currentUser,
      this.isUserSupportAgent,
      this.otherMembers,
      this.supportAgentMembers,
      this.agentSession, // Thread context object
    );

    this.supportAgentUser = this.supportAgent
      ? this.getSupportAgentUser(this.supportAgent, [
          this.currentUser,
          ...this.otherMembers,
        ])
      : undefined;

    if (this.otherMembers && this.otherMembers.length > 0) {
      this.isSupportChat =
        this.supportAgent !== undefined ||
        this.thread.threadType === 'admin_preferred_chat';
      this.isGroupChat = this.thread.threadType === ThreadTypeApi.GROUP;
      this.isTeamChat =
        this.thread.threadType === ThreadTypeApi.TEAM ||
        this.thread.threadType === ThreadTypeApi.TEAM_OFFICIAL ||
        this.thread.context.type === ContextTypeApi.TEAM;
    }
    this.isThreadSupportSession =
      this.thread.context &&
      this.thread.context.type === ContextTypeApi.SUPPORT_SESSION;
    this.isUnread = this.thread.messageUnreadCount > 0;
    this.setTitles();
    this.isFocused =
      this.focusState === FocusState.Header ||
      this.focusState === FocusState.HeaderAndTypingBox;
    this.isArrowProject =
      (this.project && this.project.isArrowProject) || false;
  }

  getSupportAgent(
    currentUser: User,
    isCurrentUserSupportAgent: boolean,
    otherMembers: ReadonlyArray<User> | undefined,
    supportAgentMembers: ReadonlyArray<Agent> | undefined,
    agentSession: AgentSession | undefined,
  ): Agent | undefined {
    if (!supportAgentMembers) {
      return undefined;
    }

    if (isCurrentUserSupportAgent) {
      return supportAgentMembers.find(agent =>
        // If the thread is associated with a support session then only return
        // the agent which is of the same support type as the agent session.
        agentSession
          ? agent.userId === currentUser.id && agent.type === agentSession.type
          : agent.userId === currentUser.id,
      );
    }

    if (!isCurrentUserSupportAgent && otherMembers) {
      return supportAgentMembers.find(agent =>
        otherMembers.map(member => member.id).includes(agent.userId),
      );
    }

    return undefined;
  }

  getSupportAgentUser(
    supportAgent: Agent,
    users: ReadonlyArray<User>,
  ): User | undefined {
    return users.find(user => user.id === supportAgent.userId);
  }

  setTitles() {
    this.showLastSeen = false;
    if (
      this.thread.threadType === ThreadTypeApi.GROUP ||
      this.thread.threadType === ThreadTypeApi.TEAM
    ) {
      const otherMembersList = this.otherMembers
        .map(u => u.displayName)
        .join(', ');
      if (this.project && this.thread.context.type === ContextTypeApi.PROJECT) {
        this.title = this.project.title;
        this.titleLink = `/projects/${this.project.seoUrl}`;
        this.secondaryTitle = otherMembersList;
      } else if (
        this.contest &&
        this.thread.context.type === ContextTypeApi.CONTEST
      ) {
        this.title = this.contest.title;
        this.titleLink = this.contest.seoUrl;
        this.secondaryTitle = otherMembersList;
      } else {
        this.title = otherMembersList;
        this.titleLink = undefined;
        this.secondaryTitle = undefined;
      }
    } else if (
      this.isSupportChat &&
      this.isUserSupportAgent &&
      this.supportAgent &&
      this.otherUser
    ) {
      // distinct display name
      this.title = this.otherUser.displayName;
      this.titleLink = this.otherUser.profileUrl;
      this.secondaryTitle =
        this.otherUser.username === this.otherUser.displayName
          ? HeaderComponent.getSupportQueueTitle(this.supportAgent)
          : `(${this.otherUser.username})`;
    } else if (
      this.isSupportChat &&
      this.supportAgent &&
      this.supportAgentUser
    ) {
      this.title = this.supportAgentUser.displayName;
      this.titleLink = this.otherUser ? this.otherUser.profileUrl : undefined;
      this.secondaryTitle = 'Freelancer Staff';
    } else if (
      this.team &&
      this.thread.threadType === ThreadTypeApi.TEAM_OFFICIAL
    ) {
      this.title = this.team.name;
      this.titleLink = `/teams/${this.team.id}`;
      this.secondaryTitle = 'Official Group Chat';
    } else if (this.otherUser) {
      this.title = this.otherUser.displayName;
      this.titleLink = this.otherUser.profileUrl;
      this.titleParams = this.project
        ? { ref_project_id: this.project.id }
        : undefined;
      this.secondaryTitle = undefined;
      if (
        this.otherUser.onlineOfflineStatus &&
        this.otherUser.onlineOfflineStatus.lastUpdatedTimestamp !== undefined &&
        this.otherUser.onlineOfflineStatus.status ===
          OnlineOfflineStatusApi.OFFLINE
      ) {
        this.lastSeenDate = new Date(
          this.otherUser.onlineOfflineStatus.lastUpdatedTimestamp,
        );
        this.showLastSeen = true;
      }
    } else {
      this.title = 'Private Chat';
      this.titleLink = undefined;
      this.secondaryTitle = undefined;
    }
  }

  /**
   * Wether this user can add add people to this chat.
   * People that can add others to chats:
   * - Thread owner in non-recruiter chat
   * - Recruiters in all chats
   * - Team members in team chats excluding official team chats
   */
  canManageChatMembers() {
    if (
      (this.thread.context.type === ContextTypeApi.TEAM &&
        this.thread.threadType !== ThreadTypeApi.TEAM_OFFICIAL) ||
      (this.thread.threadType === ThreadTypeApi.TEAM && this.team)
    ) {
      return true;
    }

    if (this.thread.threadType === ThreadTypeApi.TEAM_OFFICIAL) {
      return false;
    }

    return (
      (this.isThreadOwner && !this.isSupportChat) || this.isUserSupportAgent
    );
  }

  handleBlockedClick(e: MouseEvent) {
    e.stopPropagation();
  }

  handleClose(e: MouseEvent) {
    e.stopPropagation();
    this.closeChat.emit();
  }

  handleSettingsButtonClick(e: MouseEvent) {
    e.stopPropagation();
    this.handleSettingsHeaderClick.emit();
  }

  handleGroupchatButtonClick(e: MouseEvent) {
    e.stopPropagation();
    this.handleGroupchatHeaderClick.emit();
  }

  handleAudioCallClick(e: MouseEvent) {
    e.stopPropagation();
    this.startCall(CallType.AUDIO);
    this.makingCall.emit(true);
  }

  handleVideoCallClick(e: MouseEvent) {
    e.stopPropagation();
    this.startCall(CallType.VIDEO);
    this.makingCall.emit(true);
  }

  startCall(action: CallType) {
    this.videochat.openCallWindow(action, this.thread.id, false);
  }
}
