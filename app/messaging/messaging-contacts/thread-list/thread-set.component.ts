import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  Contest,
  OnlineOfflineUserStatus,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontStyle,
  FontType,
  FontWeight,
  TextSize,
} from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { isDefined } from '@freelancer/utils';
import { ThreadTypeApi } from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';

export interface ThreadSet {
  title?: string;
  threads: ReadonlyArray<Thread>;
  index: ThreadSetIndex;
}

export enum ThreadSetKey {
  SEARCH = 'search_results',
  ACTIVE = 'default',
  OTHER = 'other',
}

export enum ThreadSetIndex {
  SEARCH,
  ACTIVE,
  TEAMS,
  OTHER,
  SUPPORT,
}

export enum ThreadTitleType {
  CONTEXT_TITLE = 'Context Title',
  USERNAME = 'Username',
}

@Component({
  selector: 'app-thread-set',
  template: `
    <fl-list
      *ngIf="threadSet.threads.length > 0"
      [bodyEdgeToEdge]="true"
      [clickable]="threadSet.index === ThreadSetIndex.TEAMS"
      [expandable]="threadSet.index === ThreadSetIndex.TEAMS"
      [padding]="ListItemPadding.XXXSMALL"
      [type]="ListItemType.DEFAULT"
    >
      <fl-list-item [ngClass]="{ GrayBackground: grayBackground }">
        <fl-list-item-header class="ThreadSetHeader" *ngIf="threadSet.title">
          <ng-container [ngSwitch]="threadSet.index">
            <fl-text
              class="ThreadRowTitle"
              *ngSwitchCase="ThreadSetIndex.OTHER"
              [size]="TextSize.XSMALL"
              [fontType]="FontType.SPAN"
              i18n="Title for a list of 'other' threads"
            >
              OTHER CHATS
            </fl-text>
            <fl-text
              class="ThreadRowTitle"
              *ngSwitchDefault
              [size]="TextSize.XSMALL"
              [fontType]="FontType.SPAN"
            >
              {{ threadSet.title | uppercase }}
            </fl-text>
          </ng-container>
        </fl-list-item-header>
        <fl-list-item-body
          class="ThreadSetBody"
          *ngIf="threadSet.threads.length > 0"
        >
          <fl-bit class="ThreadList">
            <fl-bit
              class="ThreadListItem"
              *ngFor="let thread of threadSet.threads; trackBy: identifyThread"
            >
              <fl-bit
                class="ThreadListItemRow"
                [ngClass]="{
                  Selected: inboxMode && selectedThreadId === thread.id
                }"
                flTrackingLabel="ThreadSelected"
                flTrackingReferenceId="{{ thread.id }}"
                flTrackingReferenceType="thread_id"
                (click)="handleThreadSelected(thread)"
              >
                <fl-bit class="AvatarContainer">
                  <fl-user-avatar
                    *ngIf="thread.otherMembers.length > 0"
                    [users]="getThreadMembers(thread)"
                    [isOnline]="
                      thread.otherMembers.length === 1 &&
                      users[thread.otherMembers[0]]
                        ? (users[thread.otherMembers[0]]
                          | isOnline: (onlineOfflineStatuses$ | async))
                        : undefined
                    "
                    [flMarginRight]="Margin.XXXSMALL"
                  ></fl-user-avatar>
                </fl-bit>
                <fl-bit class="MainRow">
                  <fl-bit class="MainRowContent">
                    <fl-bit
                      *ngIf="getTitleType(thread) as threadTitleType"
                      class="TextContainer"
                    >
                      <fl-username
                        *ngIf="
                          threadTitleType === ThreadTitleType.USERNAME &&
                            thread.otherMembers?.length > 0 &&
                            users[thread.otherMembers[0]];
                          else displayThreadTitle
                        "
                        class="Username"
                        [truncateText]="true"
                        [displayName]="
                          users[thread.otherMembers[0]]?.displayName
                        "
                        [truncateText]="true"
                        [username]="users[thread.otherMembers[0]]?.username"
                        [flMarginBottom]="Margin.XXXSMALL"
                      >
                      </fl-username>

                      <ng-template #displayThreadTitle>
                        <fl-text
                          class="Title"
                          data-uitest-target="contactlist-thread-item-title"
                          [size]="TextSize.XSMALL"
                          [weight]="FontWeight.MEDIUM"
                          [flMarginBottom]="Margin.XXXSMALL"
                        >
                          {{ getTitle(thread) }}
                        </fl-text>
                      </ng-template>
                    </fl-bit>
                    <fl-bit
                      *ngIf="inboxMode && thread.message?.timeCreated"
                      class="IconContainer"
                    >
                      <fl-relative-time
                        [date]="thread.message?.timeCreated"
                        [strict]="true"
                        [includeSeconds]="false"
                      ></fl-relative-time>
                    </fl-bit>
                  </fl-bit>
                  <fl-bit class="MainRowContent">
                    <fl-bit class="TextContainer">
                      <fl-text
                        *ngIf="
                          thread.highlights && thread.highlights[0];
                          else displaySubtitle
                        "
                        [fontType]="FontType.SPAN"
                      >
                        <fl-text
                          class="Subtitle"
                          [fontType]="FontType.SPAN"
                          [color]="FontColor.MID"
                          [style]="FontStyle.ITALIC"
                        >
                          {{ thread.highlights[0].highlightedText.preceding }}
                        </fl-text>
                        <fl-text
                          class="Highlighted Subtitle"
                          [fontType]="FontType.SPAN"
                          [color]="FontColor.MID"
                          [style]="FontStyle.ITALIC"
                        >
                          {{ thread.highlights[0].highlightedText.highlighted }}
                        </fl-text>
                        <fl-text
                          class="Subtitle"
                          [fontType]="FontType.SPAN"
                          [color]="FontColor.MID"
                          [style]="FontStyle.ITALIC"
                        >
                          {{ thread.highlights[0].highlightedText.succeeding }}
                        </fl-text>
                      </fl-text>
                      <ng-template #displaySubtitle>
                        <fl-text
                          class="Subtitle"
                          *ngIf="!!getSubtitle(thread)"
                          [fontType]="FontType.SPAN"
                          [color]="
                            thread.messageUnreadCount > 0
                              ? FontColor.DARK
                              : FontColor.MID
                          "
                          [weight]="
                            thread.messageUnreadCount > 0
                              ? FontWeight.BOLD
                              : FontWeight.NORMAL
                          "
                        >
                          {{ getSubtitle(thread) }}
                        </fl-text>
                      </ng-template>
                    </fl-bit>
                    <fl-bit class="IconContainer">
                      <fl-text
                        class="UnreadCount"
                        *ngIf="thread.messageUnreadCount > 0"
                        data-size="mid"
                        [size]="TextSize.XXXSMALL"
                        [fontType]="FontType.SPAN"
                        [weight]="FontWeight.BOLD"
                        [color]="FontColor.LIGHT"
                      >
                        {{
                          thread.messageUnreadCount < 100
                            ? thread.messageUnreadCount
                            : '99+'
                        }}
                      </fl-text>
                    </fl-bit>
                  </fl-bit>
                </fl-bit>
              </fl-bit>
            </fl-bit>
          </fl-bit>
        </fl-list-item-body>
      </fl-list-item>
    </fl-list>
  `,
  styleUrls: ['./thread-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadSetComponent {
  Margin = Margin;
  TextSize = TextSize;
  FontColor = FontColor;
  FontStyle = FontStyle;
  FontType = FontType;
  FontWeight = FontWeight;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  TooltipPosition = TooltipPosition;
  ListItemType = ListItemType;
  ListItemPadding = ListItemPadding;
  ThreadSetIndex = ThreadSetIndex;
  ThreadTitleType = ThreadTitleType;

  @Input() grayBackground = false;
  @Input() threadSet: ThreadSet;
  @Input() users: { [key: number]: User };
  @Input() contests: { [key: number]: Contest };
  @Input() projects: { [key: number]: ThreadProject };

  @Input() inboxMode: boolean;

  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;

  @Input() selectedThreadId?: number;

  @Output() selectThread = new EventEmitter<Thread>();

  handleThreadSelected(thread: Thread) {
    this.selectThread.emit(thread);
  }

  getThreadMembers(thread: Thread) {
    const ret = thread.otherMembers
      .map(u => this.users[u] || undefined)
      .filter(isDefined);
    return ret;
  }

  getTitleType(thread: Thread): ThreadTitleType {
    return thread.threadType === ThreadTypeApi.PRIVATE_CHAT ||
      thread.threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT ||
      thread.threadType === ThreadTypeApi.PRIMARY
      ? ThreadTitleType.USERNAME
      : ThreadTitleType.CONTEXT_TITLE;
  }

  getTitle(thread: Thread): string {
    if (
      thread.context.type === 'project' &&
      this.projects &&
      this.projects[thread.context.id]
    ) {
      return this.projects[thread.context.id].title;
    }

    if (
      thread.context.type === 'contest' &&
      this.contests &&
      this.contests[thread.context.id]
    ) {
      return this.contests[thread.context.id].title;
    }

    if (
      thread.threadType === ThreadTypeApi.TEAM_OFFICIAL &&
      this.threadSet.title
    ) {
      return this.threadSet.title;
    }

    return thread.otherMembers
      .filter(u => this.users[u])
      .map(u => this.users[u].displayName)
      .join(', ');
  }

  getSubtitle(thread: Thread): string | undefined {
    if (
      (thread.context.type === 'contest' &&
        !this.contests[thread.context.id]) ||
      (thread.context.type === 'project' && !this.projects[thread.context.id])
    ) {
      return `This ${thread.context.type} has been deleted`;
    }

    if (thread.message) {
      if (thread.message.message) {
        return thread.message.message;
      }

      const messageUser = this.users[thread.message.fromUser];
      if (thread.message.attachments && messageUser) {
        return `${messageUser.displayName} sent an attachment`;
      }
    }

    // There are cases where there is no last message returned by the API, so we display
    // the project title instead for private chats (group chats and recruiter chats excluded).
    // This should be removed once T207520 is done
    if (
      !thread.message &&
      thread.threadType !== ThreadTypeApi.ADMIN_PREFERRED_CHAT &&
      thread.threadType !== ThreadTypeApi.GROUP &&
      (thread.context.type === 'project' || thread.context.type === 'contest')
    ) {
      return this.getTitle(thread);
    }

    if (thread.threadType === ThreadTypeApi.TEAM_OFFICIAL) {
      return 'Official Group Chat';
    }

    return undefined;
  }

  identifyThread(index: number, thread: Thread) {
    return thread.id;
  }
}
