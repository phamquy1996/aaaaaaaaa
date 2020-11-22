import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Datastore } from '@freelancer/datastore';
import {
  OnlineOfflineCollection,
  Thread,
  ThreadContext,
  ThreadContextType,
  ThreadsCollection,
  ThreadType,
} from '@freelancer/datastore/collections';
import { MessagingChat } from '@freelancer/messaging-chat';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { Margin } from '@freelancer/ui/margin';
import { OnlineIndicatorSize } from '@freelancer/ui/online-indicator';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';
import { ThreadTypeApi } from 'api-typings/messages/messages_types';
import { OnlineOfflineStatusApi } from 'api-typings/users/users';
import * as Rx from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'fl-chat-button',
  template: `
    <ng-template #button let-thread="thread">
      <fl-button
        class="ChatButton"
        [attr.data-animate]="!!(unreadMessagesNumber$ | async)"
        [color]="color"
        [disabled]="disabled"
        [display]="display"
        [size]="size"
        (click)="chat(thread?.id)"
      >
        <fl-bit class="ChatButton-wrapper">
          <fl-online-indicator
            class="ChatButton-indicator"
            [isOnline]="isOnline$ | async"
            [flMarginRight]="Margin.XXSMALL"
            [size]="onlineIndicatorSize"
          ></fl-online-indicator>
          <fl-text
            i18n="Chat button (verb)"
            [size]="TextSize.INHERIT"
            [fontType]="FontType.SPAN"
            [weight]="FontWeight.BOLD"
            [color]="FontColor.MID"
          >
            Chat
          </fl-text>
          <fl-text
            *ngIf="unreadMessagesNumber$ | async as unReadNumber"
            class="UnreadCount"
            [attr.data-notification-size]="notificationSize"
            [size]="notificationSize"
            [fontType]="FontType.SPAN"
            [weight]="FontWeight.BOLD"
            [color]="FontColor.LIGHT"
          >
            {{ unReadNumber < 100 ? unReadNumber : '99' }}
          </fl-text>
        </fl-bit>
      </fl-button>
    </ng-template>
    <ng-container
      *ngTemplateOutlet="button; context: { thread: thread$ | async }"
    ></ng-container>
  `,
  styleUrls: ['./chat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatButtonComponent implements OnInit, OnChanges {
  Margin = Margin;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  FontColor = FontColor;
  ButtonSize = ButtonSize;

  /**
   * Other members of the chat.
   * The online indicator will use the first member in the list
   */
  @Input() otherMemberIds: number[];

  /**
   * Override thread type where the default value is
   * PRIVATE if otherMembers length is 1 or
   * GROUP if otherMembers length is greater than 1.
   */
  @Input() threadType?: ThreadType;
  @Input() contextType: ThreadContextType;
  @Input() contextId: number;
  @Input() disabled = false;
  @Input() color = ButtonColor.DEFAULT;

  @HostBinding('attr.data-display')
  @Input()
  display: 'block' | 'inline' = 'inline';

  /** Size of the button. Automatically adjusts font/notification size. */
  @Input() size = ButtonSize.SMALL;
  notificationSize = TextSize.XXSMALL;
  onlineIndicatorSize = OnlineIndicatorSize.SMALL;

  isOnline$: Rx.Observable<boolean>;
  thread$: Rx.Observable<Thread | undefined>;
  unreadMessagesNumber$: Rx.Observable<number | false>;

  constructor(
    private datastore: Datastore,
    private messagingChat: MessagingChat,
  ) {}

  ngOnInit() {
    this.setupOtherMembers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('size' in changes) {
      switch (this.size) {
        case ButtonSize.MINI:
          this.notificationSize = TextSize.XXXSMALL;
          this.onlineIndicatorSize = OnlineIndicatorSize.SMALL;
          break;
        case ButtonSize.SMALL:
          this.notificationSize = TextSize.XXSMALL;
          this.onlineIndicatorSize = OnlineIndicatorSize.SMALL;
          break;
        case ButtonSize.LARGE:
          this.notificationSize = TextSize.XSMALL;
          this.onlineIndicatorSize = OnlineIndicatorSize.LARGE;
          break;
        case ButtonSize.XLARGE:
          this.notificationSize = TextSize.SMALL;
          this.onlineIndicatorSize = OnlineIndicatorSize.XLARGE;
          break;
        case ButtonSize.XXLARGE:
          this.notificationSize = TextSize.MID;
          this.onlineIndicatorSize = OnlineIndicatorSize.SMALL;
          break;
        default:
          this.notificationSize = TextSize.XXSMALL;
          this.onlineIndicatorSize = OnlineIndicatorSize.SMALL;
      }
    }

    if ('otherMemberIds' in changes) {
      this.setupOtherMembers();
    }
  }

  chat(threadId: number | undefined) {
    this.messagingChat.startChat({
      threadId,
      userIds: this.otherMemberIds,
      threadType: this.getThreadType(),
      origin: '', // unused, even by the messaging chat component
      context: this.getThreadContext(),
    });
  }

  private setupOtherMembers() {
    this.isOnline$ = this.datastore
      .document<OnlineOfflineCollection>(
        'onlineOffline',
        this.otherMemberIds[0],
      )
      .valueChanges()
      .pipe(
        map(status => status.status === OnlineOfflineStatusApi.ONLINE),
        startWith(false),
      );

    this.thread$ = this.datastore
      .collection<ThreadsCollection>('threads', query =>
        query
          .where('otherMembers', 'equalsIgnoreOrder', this.otherMemberIds)
          .where('context', '==', this.getThreadContext())
          .where(
            'threadType',
            '==',
            this.otherMemberIds.length === 1
              ? ThreadTypeApi.PRIVATE_CHAT
              : ThreadTypeApi.GROUP,
          ),
      )
      .valueChanges()
      .pipe(map(a => a[0]));

    this.unreadMessagesNumber$ = this.thread$.pipe(
      map(thread => !!thread && thread.messageUnreadCount),
    );
  }

  private getThreadType(): ThreadType {
    if (this.threadType) {
      return this.threadType;
    }

    return this.otherMemberIds.length === 1
      ? ThreadTypeApi.PRIVATE_CHAT
      : ThreadTypeApi.GROUP;
  }

  private getThreadContext(): ThreadContext {
    return {
      type: this.contextType,
      id: this.contextId,
    };
  }
}
