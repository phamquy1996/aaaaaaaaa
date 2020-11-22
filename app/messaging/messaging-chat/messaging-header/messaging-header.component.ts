import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Agent,
  Contest,
  OnlineOfflineUserStatus,
  OnlineOfflineUserStatusValue,
  Team,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';
import { IconColor } from '@freelancer/ui/icon';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { UsernameSize } from '@freelancer/ui/username';
import { ContextTypeApi } from 'api-typings/common/common';
import { ThreadTypeApi } from 'api-typings/messages/messages_types';
import { SupportTypeApi } from 'api-typings/support/support';

export enum TitleType {
  CUSTOM,
  DEFAULT,
  USER,
}

enum SecondaryTitleType {
  CUSTOM,
  GENERIC_AGENT_TITLE,
  NONE,
  TEAM_CHAT,
}

interface HeaderDetails {
  readonly titleType: TitleType;
  readonly title?: string;
  readonly titleLink?: string;
  readonly titleLinkParams?: { [key: string]: number };
  readonly user?: User;
  readonly secondaryTitleType: SecondaryTitleType;
  readonly secondaryTitle?: string;
  readonly secondaryTitleLink?: string;
}
@Component({
  selector: 'app-messaging-header',
  template: `
    <fl-bit class="Header-details" [flMarginRight]="Margin.MID">
      <fl-user-avatar
        [flMarginRight]="Margin.XSMALL"
        [isOnline]="isOnline"
        [size]="chatboxMode ? AvatarSize.SMALL : AvatarSize.MID"
        [users]="otherMembers"
      ></fl-user-avatar>
      <fl-bit class="Header-details-text">
        <fl-text
          *ngIf="
            chatboxMode || headerDetails.titleType !== TitleType.USER;
            else username
          "
          [color]="chatboxMode ? FontColor.LIGHT : FontColor.DARK"
          [maxLines]="1"
          [size]="chatboxMode ? TextSize.XSMALL : TextSize.SMALL"
          [weight]="FontWeight.BOLD"
        >
          <ng-container
            *ngIf="
              headerDetails.titleType === TitleType.DEFAULT;
              else customTitle
            "
            i18n="Private Chat text"
          >
            Private Chat
          </ng-container>
          <ng-template #customTitle>
            <fl-link
              *ngIf="headerDetails?.titleLink; else plainTitle"
              flTrackingLabel="ChatboxHeaderTitle"
              [color]="LinkColor.INHERIT"
              [hoverColor]="
                chatboxMode ? LinkHoverColor.LIGHT : LinkHoverColor.DEFAULT
              "
              [queryParams]="headerDetails.titleLinkParams"
              [link]="headerDetails.titleLink"
              [size]="TextSize.INHERIT"
            >
              {{ headerDetails.title }}
            </fl-link>
            <ng-template #plainTitle>{{ headerDetails.title }}</ng-template>
          </ng-template>
        </fl-text>
        <ng-template #username>
          <fl-username
            flTrackingLabel="ChatboxHeaderTitle"
            [displayName]="headerDetails.user?.displayName"
            [username]="headerDetails.user?.username"
            [link]="headerDetails.titleLink"
            [size]="UsernameSize.LARGE"
          ></fl-username
        ></ng-template>
        <fl-text
          *ngIf="headerDetails.secondaryTitleType !== SecondaryTitleType.NONE"
          [color]="chatboxMode ? FontColor.LIGHT : FontColor.DARK"
          [maxLines]="1"
          [size]="chatboxMode ? TextSize.XSMALL : TextSize.SMALL"
        >
          <fl-link
            *ngIf="headerDetails?.secondaryTitleLink; else plainSecondaryTitle"
            flTrackingLabel="ChatboxHeaderSecondaryTitle"
            i18n="Header text"
            [color]="LinkColor.INHERIT"
            [hoverColor]="
              chatboxMode ? LinkHoverColor.LIGHT : LinkHoverColor.DEFAULT
            "
            [link]="headerDetails.secondaryTitleLink"
            [size]="TextSize.INHERIT"
          >
            <ng-container
              *ngTemplateOutlet="plainSecondaryTitle"
            ></ng-container>
          </fl-link>
          <ng-template #plainSecondaryTitle>
            <ng-container [ngSwitch]="headerDetails.secondaryTitleType">
              <ng-container
                *ngSwitchCase="SecondaryTitleType.CUSTOM"
                i18n="Contest status label"
              >
                {{ headerDetails.secondaryTitle }}
              </ng-container>
              <ng-container
                *ngSwitchCase="SecondaryTitleType.GENERIC_AGENT_TITLE"
                i18n="Freelancer Staff text"
              >
                Freelancer Staff
              </ng-container>
              <ng-container
                *ngSwitchCase="SecondaryTitleType.TEAM_CHAT"
                i18n="Official Group Chat text"
              >
                Official Group Chat
              </ng-container>
            </ng-container>
          </ng-template>
        </fl-text>
      </fl-bit>
    </fl-bit>
    <app-messaging-header-controls
      [chatboxMode]="chatboxMode"
      [iconColor]="chatboxMode ? IconColor.LIGHT : IconColor.INHERIT"
      (click)="switchMode()"
    >
    </app-messaging-header-controls>
  `,
  styleUrls: ['./messaging-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingHeaderComponent implements OnChanges {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconColor = IconColor;
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  Margin = Margin;
  TextSize = TextSize;
  UsernameSize = UsernameSize;

  SecondaryTitleType = SecondaryTitleType;
  SupportTypeApi = SupportTypeApi;
  TitleType = TitleType;

  @Input() membersActivityStatus?: ReadonlyArray<OnlineOfflineUserStatus>;
  @Input() contextObject?: Contest | ThreadProject;
  @Input() loggedInUser: User;
  @Input() otherMembers: ReadonlyArray<User>;
  @Input() supportAgent?: Agent;
  @Input() team?: Team;
  @Input() thread: Thread;

  @HostBinding('class.ChatboxMode')
  @Input()
  chatboxMode = true;

  headerDetails: HeaderDetails;
  isOnline?: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (
      'membersActivityStatus' in changes ||
      'loggedInUser' in changes ||
      ('otherMembers' in changes && this.otherMembers)
    ) {
      this.isOnline =
        // isOnline input doesn't work if users input is > 1
        this.membersActivityStatus && this.otherMembers.length === 1
          ? this.membersActivityStatus
              .filter(memberStatus => memberStatus.id !== this.loggedInUser.id)
              .map(memberStatus => memberStatus.status)
              .includes(OnlineOfflineUserStatusValue.ONLINE)
          : undefined;
    }

    if (
      'contextObject' in changes ||
      'loggedInUser' in changes ||
      'otherMembers' in changes ||
      'supportAgent' in changes ||
      'team' in changes ||
      'thread' in changes
    ) {
      this.headerDetails = this.getHeaderDetails();
    }
  }

  getHeaderDetails(): HeaderDetails {
    if (
      !this.otherMembers ||
      this.otherMembers.length === 0 ||
      !this.loggedInUser
    ) {
      return {
        titleType: TitleType.DEFAULT,
        secondaryTitleType: SecondaryTitleType.NONE,
      };
    }

    const [otherUser] = this.otherMembers;

    if (
      this.thread.threadType === ThreadTypeApi.GROUP ||
      this.thread.threadType === ThreadTypeApi.TEAM
    ) {
      const otherMembersList = this.otherMembers
        .map(u => u.displayName)
        .join(', ');

      return this.contextObject
        ? {
            titleType: TitleType.CUSTOM,
            title: this.contextObject.title,
            titleLink: this.getContextObjectUrl(
              this.contextObject,
              this.thread,
            ),
            secondaryTitleType: SecondaryTitleType.CUSTOM,
            secondaryTitle: otherMembersList,
          }
        : {
            titleType: TitleType.CUSTOM,
            title: otherMembersList,
            secondaryTitleType: SecondaryTitleType.NONE,
          };
    }

    if (
      this.thread.threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT &&
      this.supportAgent
    ) {
      if (this.loggedInUser.id === this.supportAgent.userId) {
        return {
          titleType: TitleType.USER,
          title: otherUser.displayName,
          titleLink: otherUser.profileUrl,
          user: otherUser,
          secondaryTitleType: SecondaryTitleType.CUSTOM,
          secondaryTitle:
            otherUser.username === otherUser.displayName
              ? this.getSupportQueueTitle(this.supportAgent)
              : `(${otherUser.username})`,
        };
      }

      const supportAgentUser = this.otherMembers.find(
        member => this.supportAgent?.userId === member.id,
      );
      if (supportAgentUser) {
        return {
          titleType: TitleType.USER,
          title: supportAgentUser.displayName,
          titleLink: supportAgentUser.profileUrl,
          user: supportAgentUser,
          secondaryTitleType: SecondaryTitleType.GENERIC_AGENT_TITLE,
        };
      }
    }

    if (this.thread.threadType === ThreadTypeApi.TEAM_OFFICIAL && this.team) {
      return {
        titleType: TitleType.CUSTOM,
        title: this.team.name,
        titleLink: `/teams/${this.team.id}`,
        secondaryTitleType: SecondaryTitleType.TEAM_CHAT,
      };
    }

    return {
      titleType: TitleType.USER,
      title: otherUser.displayName,
      titleLink: otherUser.profileUrl,
      user: otherUser,
      titleLinkParams:
        this.thread.context.type === ContextTypeApi.PROJECT &&
        this.contextObject
          ? { ref_project_id: this.contextObject.id }
          : undefined,
      secondaryTitleType: this.contextObject
        ? SecondaryTitleType.CUSTOM
        : SecondaryTitleType.NONE,
      secondaryTitle: this.contextObject?.title,
      secondaryTitleLink: this.contextObject
        ? this.getContextObjectUrl(this.contextObject, this.thread)
        : undefined,
    };
  }

  /**
   * Thread sub-title used for internal staff chats. I.e. this is not shown
   * to users.
   */
  getSupportQueueTitle(supportAgent: Agent): string {
    switch (supportAgent.type) {
      case SupportTypeApi.RECRUITER:
        return 'Recruiter Chat';
      case SupportTypeApi.GENERAL:
        return 'General Chat';
      case SupportTypeApi.LOCAL:
        return 'Local Jobs';
      default:
        // Convert underscore-case to start-case
        // E.g. pfp_tickets => Pfp Tickets
        return supportAgent.type
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }

  getContextObjectUrl(object: ThreadProject | Contest, thread: Thread): string {
    return `${
      thread.context.type === ContextTypeApi.CONTEST ? '/' : '/projects/'
    }${object.seoUrl}`;
  }

  // This is just for testing
  switchMode() {
    this.chatboxMode = !this.chatboxMode;
  }
}
