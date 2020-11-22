import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import {
  OnlineOfflineUserStatus,
  Thread,
  User,
} from '@freelancer/datastore/collections';
import { MessagingChat } from '@freelancer/messaging-chat';
import { Margin } from '@freelancer/ui/margin';
import { isDefined } from '@freelancer/utils';
import { ThreadTypeApi } from 'api-typings/messages/messages_types';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-message-item',
  template: `
    <a [href]="inboxLink" flTrackingLabel="MessageFeedItem">
      <app-feed-item
        thumbnail="image"
        [highlighted]="thread.messageUnreadCount > 0"
        [users]="otherUsers"
        thumbnailAlt=""
        flTrackingLabel="MessageFeedItem"
      >
        <fl-bit class="WebappThread">
          <fl-bit
            class="WebappThreadTitle"
            *ngIf="!showUsernameTag"
            [flMarginRight]="Margin.XXXSMALL"
          >
            {{ threadTitle }}
          </fl-bit>
          <fl-bit
            class="WebappThreadTitle"
            *ngIf="showUsernameTag && !!firstOtherUser"
          >
            <fl-username
              [displayName]="threadTitle"
              [username]="firstOtherUser.username"
            ></fl-username>
          </fl-bit>
          <fl-online-indicator
            class="WebappThreadOnlineIndicator"
            *ngIf="firstOtherUser"
            [username]="firstOtherUser.username"
            [isOnline]="
              !!(firstOtherUser | isOnline: (onlineOfflineStatuses$ | async))
            "
          ></fl-online-indicator>
        </fl-bit>
        <fl-bit class="WebappThreadAttachment">
          <!-- TODO T37449 get actual attachment name -->
          {{
            thread.message && thread.message.message
              ? thread.message.message
              : '[Attachment]'
          }}
        </fl-bit>
        <fl-relative-time [date]="thread.timeUpdated" [suffix]="true">
        </fl-relative-time>
      </app-feed-item>
    </a>
  `,
  styleUrls: ['./message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageItemComponent implements OnChanges {
  Margin = Margin;

  @Input() thread: Thread;
  @Input() users: ReadonlyArray<User>;
  @Input()
  onlineOfflineStatuses$: Rx.Observable<ReadonlyArray<OnlineOfflineUserStatus>>;

  placeholder: string;
  otherUsers: ReadonlyArray<User> = [];
  threadTitle: string;
  firstOtherUser?: User;
  inboxLink: string;
  showUsernameTag: boolean;

  constructor(private messagingChat: MessagingChat) {}

  ngOnChanges() {
    this.otherUsers = this.thread.otherMembers
      .map(uId => this.users.find(user => user.id === uId))
      .filter(isDefined);

    [this.firstOtherUser] = this.otherUsers;

    this.threadTitle = this.otherUsers.map(u => u.displayName).join(', ');

    this.inboxLink = `/messages/thread/${this.thread.id}`;

    this.showUsernameTag =
      this.firstOtherUser &&
      (this.thread.threadType === ThreadTypeApi.PRIVATE_CHAT ||
        this.thread.threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT ||
        this.thread.threadType === ThreadTypeApi.PRIMARY);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.preventDefault();

    this.messagingChat.startChat({
      userIds: this.thread.members,
      threadType: this.thread.threadType,
      origin: 'ng-navigation',
      context: this.thread.context,
      threadId: this.thread.id,
      focus: true,
    });
  }
}
