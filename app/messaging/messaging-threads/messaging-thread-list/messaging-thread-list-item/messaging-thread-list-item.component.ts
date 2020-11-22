import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { User } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontStyle,
  FontType,
  FontWeight,
  TextSize,
} from '@freelancer/ui/text';
import { isDefined } from '@freelancer/utils';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import {
  ThreadDetails,
  ThreadSubtitleType,
  ThreadTitleType,
} from '../../messaging-threads.types';

@Component({
  selector: 'app-messaging-thread-list-item',
  template: `
    <!--
      NOTE: We need to be able to right click a thread list item and open it on
      new tab, while clicking on the item shouldopen a chatbox. Hence, we need to
      prevent the link from redirecting onclick, which only works with <a> here
      instead of <fl-link>.
    -->
    <a
      flTrackingLabel="MessagingThreadListItem"
      [href]="'/messages/thread/' + threadDetails.thread.id"
    >
      <fl-bit *ngIf="threadDetails" class="ThreadListItem">
        <fl-bit class="ThreadListItem-avatar">
          <fl-user-avatar
            [users]="threadOtherMembers"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-user-avatar>
        </fl-bit>
        <fl-bit class="ThreadDetailsRow">
          <fl-bit class="ThreadDetailsRow-container">
            <fl-bit class="ThreadDetailsRow-textContainer">
              <fl-username
                *ngIf="
                  threadTitleType === ThreadTitleType.USERNAME &&
                    threadOtherMembers.length > 0;
                  else displayThreadTitle
                "
                class="ThreadDetailsRow-username"
                [displayName]="threadOtherMembers[0].displayName"
                [truncateText]="true"
                [username]="threadOtherMembers[0].username"
                [flMarginBottom]="Margin.XXXSMALL"
              >
              </fl-username>
              <ng-template #displayThreadTitle>
                <fl-text
                  class="ThreadDetailsRow-title"
                  [size]="TextSize.XSMALL"
                  [weight]="FontWeight.MEDIUM"
                  [flMarginBottom]="Margin.XXXSMALL"
                >
                  {{ threadTitle }}
                </fl-text>
              </ng-template>
            </fl-bit>
            <fl-bit class="ThreadDetailsRow-iconContainer">
              <fl-relative-time
                *ngIf="threadDetails.thread.message?.timeCreated as timeCreated"
                [date]="timeCreated"
                [strict]="true"
                [includeSeconds]="false"
              ></fl-relative-time>
            </fl-bit>
          </fl-bit>

          <fl-bit class="ThreadDetailsRow-container">
            <fl-bit class="ThreadDetailsRow-textContainer">
              <app-messaging-thread-list-item-subtitle
                *ngIf="threadSubtitleType"
                [contextTitle]="threadTitle"
                [hasUnreadMessages]="
                  threadDetails.thread.messageUnreadCount > 0
                "
                [lastMessage]="threadDetails.thread.message"
                [lastMessageUser]="lastMessageUser"
                [subtitleType]="threadSubtitleType"
              ></app-messaging-thread-list-item-subtitle>
            </fl-bit>
            <fl-bit
              *ngIf="threadDetails.thread.messageUnreadCount > 0"
              class="ThreadDetailsRow-iconContainer"
            >
              <fl-text
                class="ThreadDetailsRow-unreadCount"
                [size]="TextSize.XXXSMALL"
                [fontType]="FontType.SPAN"
                [weight]="FontWeight.BOLD"
                [color]="FontColor.LIGHT"
              >
                {{
                  threadDetails.thread.messageUnreadCount < 100
                    ? threadDetails.thread.messageUnreadCount
                    : '99+'
                }}
              </fl-text>
            </fl-bit>
          </fl-bit>
        </fl-bit>
      </fl-bit>
    </a>
  `,
  styleUrls: ['./messaging-thread-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingThreadListItemComponent implements OnChanges {
  FontColor = FontColor;
  FontStyle = FontStyle;
  FontType = FontType;
  FontWeight = FontWeight;
  Margin = Margin;
  TextSize = TextSize;
  ThreadTitleType = ThreadTitleType;

  @Input() threadDetails: ThreadDetails;

  threadSubtitleType?: ThreadSubtitleType;
  threadTitle?: string;
  threadTitleType: ThreadTitleType;
  threadOtherMembers: ReadonlyArray<User>;
  lastMessageUser?: User;

  ngOnChanges() {
    if (this.threadDetails) {
      const { thread, members } = this.threadDetails;

      this.threadSubtitleType = this.getSubtitleType();

      this.threadTitleType =
        thread.threadType === ThreadTypeApi.PRIVATE_CHAT ||
        thread.threadType === ThreadTypeApi.PRIMARY ||
        thread.threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT
          ? ThreadTitleType.USERNAME
          : ThreadTitleType.CONTEXT_TITLE;

      this.threadTitle =
        this.threadTitleType === ThreadTitleType.CONTEXT_TITLE ||
        this.threadSubtitleType === ThreadSubtitleType.CONTEXT_TITLE
          ? this.getTitle()
          : undefined;

      this.threadOtherMembers = thread.otherMembers
        .map(
          otherMemberId =>
            members.find(allMembers => allMembers.id === otherMemberId) ||
            undefined,
        )
        .filter(isDefined);
    }
  }

  getTitle(): string {
    if (this.threadDetails.contextObject) {
      return this.threadDetails.contextObject.title;
    }

    // TODO: handle team chats title (which should be the team name) when filters are implemented.
    // ideally we pass the Team object in threadDetails.contextObject, but it looks like teams is
    // linked to a threadset instead of a thread

    return this.threadDetails.members
      .map(threadUsers => threadUsers.displayName)
      .join(', ');
  }

  getSubtitleType(): ThreadSubtitleType | undefined {
    const { thread, members, contextObject } = this.threadDetails;

    if (!contextObject) {
      if (thread.context.type === ContextTypeApi.PROJECT) {
        return ThreadSubtitleType.DELETED_PROJECT;
      }
      if (thread.context.type === ContextTypeApi.CONTEST) {
        return ThreadSubtitleType.DELETED_CONTEST;
      }
    }

    if (thread.message) {
      if (thread.message.message) {
        return ThreadSubtitleType.LAST_MESSAGE;
      }
      if (thread.message.attachments) {
        this.lastMessageUser = members.find(
          member => thread.message && member.id === thread.message.fromUser,
        );
        return ThreadSubtitleType.ATTACHMENT;
      }
    }

    // There are cases where there is no last message returned by the API, so we display
    // the project title instead for private chats (group chats and recruiter chats excluded).
    // This should be removed once T207520 is done
    if (
      !thread.message &&
      thread.threadType !== ThreadTypeApi.ADMIN_PREFERRED_CHAT &&
      thread.threadType !== ThreadTypeApi.GROUP &&
      (thread.context.type === ContextTypeApi.PROJECT ||
        thread.context.type === ContextTypeApi.CONTEST)
    ) {
      return ThreadSubtitleType.CONTEXT_TITLE;
    }

    if (thread.threadType === ThreadTypeApi.TEAM_OFFICIAL) {
      return ThreadSubtitleType.TEAMS;
    }

    return undefined;
  }
}
