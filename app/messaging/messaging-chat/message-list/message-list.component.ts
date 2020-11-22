import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Clipboard } from '@freelancer/clipboard';
import { Message, Thread, User } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerSize } from '@freelancer/ui/spinner';
import { FontColor, TextAlign } from '@freelancer/ui/text';
import { toNumber } from '@freelancer/utils';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import { UsersTypingMap } from '../chat-box/chat-box.component';
import { isMessageEqual } from '../helpers';
import { MessageItemComponent } from '../message-item/message-item.component';

@Component({
  selector: 'app-message-list',
  template: `
    <perfect-scrollbar
      class="MessageList-content"
      [config]="psbConfig"
      (psYReachEnd)="handleScrollAtBottom()"
    >
      <fl-spinner
        *ngIf="showLoadingSpinner"
        flTrackingLabel="ChatboxInitialisationSpinner"
        [overlay]="true"
      ></fl-spinner>
      <fl-bit class="MessageList-loadMore">
        <fl-link
          *ngIf="!showLoadingMoreSpinner && canLoadMore"
          i18n="Messaging load more button"
          flTrackingLabel="LoadMoreMessages"
          (click)="handleLoadMessages()"
        >
          Load more...
        </fl-link>
        <fl-spinner
          *ngIf="showLoadingMoreSpinner"
          flTrackingLabel="ChatboxLoadMessagesSpinner"
          [size]="SpinnerSize.SMALL"
        ></fl-spinner>
      </fl-bit>
      <ng-container
        *ngFor="
          let message of messages;
          let i = index;
          trackBy: identifyMessage
        "
      >
        <app-message-item
          [ngClass]="{
            'MessageList-content-wrapper': !chatBoxMode,
            'MessageList-content-chatbox-wrapper': chatBoxMode
          }"
          *ngIf="
            (message.message && message.message.length > 0) ||
            (message.attachments && message.attachments.length > 0) ||
            message.richMessage
          "
          [after]="messages[i + 1]"
          [before]="messages[i - 1]"
          [currentUserId]="currentUserId"
          [usersTyping]="usersTyping"
          [message]="message"
          [otherMembers]="otherMembers"
          [threadMembers]="members"
          [userReadTimes]="thread.userReadTimes"
          [chatBoxMode]="chatBoxMode"
          [useThumbnailService]="useThumbnailService"
          (resendMessage)="handleMessageResend($event)"
        ></app-message-item>
      </ng-container>
      <fl-floating-action
        *ngIf="showNewMessageFloatingAction"
        flTrackingLabel="show_new_messages"
        text="Show new messages"
        [icon]="'ui-arrow-down'"
        (click)="handleShowNewMessages()"
      ></fl-floating-action>
    </perfect-scrollbar>
    <fl-bit
      class="MessageList-emptyStateText"
      [ngClass]="{
        'MessageList-content-wrapper': !chatBoxMode,
        'MessageList-placeholder': chatBoxMode
      }"
      *ngIf="thread.isFake"
    >
      <fl-text
        [textAlign]="TextAlign.CENTER"
        [flMarginBottom]="Margin.SMALL"
        [color]="FontColor.MID"
        i18n="Label for empty chat box"
      >
        This is the start of your conversation
      </fl-text>
    </fl-bit>
    <!--
      TODO This is a hack to allow icon preloading and browser caching until we do it properly
    -->
    <fl-icon class="MessageList-preloadIcon" name="ui-refresh"></fl-icon>
  `,
  styleUrls: ['./message-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageListComponent implements AfterViewInit, OnChanges {
  FontColor = FontColor;
  Margin = Margin;
  SpinnerSize = SpinnerSize;
  TextAlign = TextAlign;
  @Input() currentUserId: string;
  @Input() members: ReadonlyArray<User>;
  @Input() messages: ReadonlyArray<Message>;
  @Input() otherMembers: ReadonlyArray<User>;
  @Input() thread: Thread;
  @Input() chatBoxMode = true;
  @Input() canLoadMore: boolean;
  @Input() showLoadingMoreSpinner = false;
  @Input() usersTyping: UsersTypingMap;
  @Input() useThumbnailService = false;

  @Output() resendMessage = new EventEmitter<Message>();
  @Output() loadMoreMessages = new EventEmitter<boolean>();

  @ViewChild(PerfectScrollbarComponent, { static: true })
  psbComponent: PerfectScrollbarComponent;
  @ViewChildren(MessageItemComponent, { read: ElementRef })
  messageComponents: QueryList<ElementRef<HTMLElement>>;
  psbConfig: PerfectScrollbarConfigInterface = {};

  // spinner flag for when the initial list of messages has not yet been loaded
  showLoadingSpinner = true;
  showNewMessageFloatingAction = false;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private clipboard: Clipboard,
  ) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Scroll for first fetch or
    // whenever message is received and scrollbar is at bottom or
    // whenever user sends a message
    if (
      changes.messages &&
      (!changes.messages.previousValue ||
        this.isAtBottom() ||
        this.isMessageSent(
          changes.messages.currentValue,
          changes.messages.previousValue,
        ))
    ) {
      setTimeout(() => this.scrollToBottom(), 0);
    }

    if (
      changes.messages &&
      this.isMessageReceived(
        changes.messages.currentValue,
        changes.messages.previousValue,
      ) &&
      !this.isAtBottom()
    ) {
      this.showNewMessageFloatingAction = true;
    }

    if (changes.thread || changes.messages) {
      // For real threads, show a spinner while the messages haven't loaded yet.
      // Also show a spinner if the thread has been updated but its messages have not.
      // We get messages in batches, so the thread id for the first message is a good
      // enough proxy for the thread id of all messages.
      // Note: [] is truthy so 0 messages will still turn off the spinner
      const firstMessageThreadId =
        this.messages && this.messages.length > 0
          ? this.messages[0].threadId
          : undefined;
      this.showLoadingSpinner =
        !this.thread ||
        (!this.thread.isFake && !this.messages) ||
        (!this.thread.isFake &&
          !!firstMessageThreadId &&
          this.thread.id !== firstMessageThreadId);
    }
  }

  @HostListener('click', ['$event'])
  ignoreSelection(event: MouseEvent) {
    const selection = this.clipboard.getSelectedText();
    if (
      selection &&
      selection.rangeCount &&
      !selection.getRangeAt(0).collapsed
    ) {
      // stop propagation to block the default click-focusing behaviour of the chatbox
      event.stopPropagation();
    }
  }

  handleMessageResend(message: Message) {
    this.resendMessage.emit(message);
  }

  handleShowNewMessages() {
    this.scrollToBottom();
  }

  isMessageReceived(
    currentMessages: ReadonlyArray<Message>,
    previousMessages: ReadonlyArray<Message>,
  ): boolean {
    const currentLastMessage = currentMessages
      ? currentMessages[currentMessages.length - 1]
      : undefined;
    const previousLastMessage = previousMessages
      ? previousMessages[previousMessages.length - 1]
      : undefined;

    return (
      !!currentLastMessage &&
      currentLastMessage.fromUser !== toNumber(this.currentUserId) &&
      !isMessageEqual(currentLastMessage, previousLastMessage)
    );
  }

  isMessageSent(
    currentMessages: ReadonlyArray<Message>,
    previousMessages: ReadonlyArray<Message>,
  ): boolean {
    const currentLastMessage = currentMessages[currentMessages.length - 1];
    const previousLastMessage = previousMessages[previousMessages.length - 1];

    if (currentLastMessage && currentLastMessage.fromUser) {
      return (
        !isMessageEqual(currentLastMessage, previousLastMessage) &&
        currentLastMessage.fromUser === toNumber(this.currentUserId)
      );
    }
    return !isMessageEqual(currentLastMessage, previousLastMessage);
  }

  scrollToBottom() {
    if (this.psbComponent.directiveRef) {
      this.psbComponent.directiveRef.scrollToBottom();
    }
  }

  isAtBottom(): boolean {
    if (
      !this.messageComponents ||
      this.messageComponents.length === 0 ||
      !this.psbComponent.directiveRef
    ) {
      return true;
    }

    // check that the last message is the only thing between the scroll location and the bottom
    // this means that we were at the bottom before we received this message
    const geometry = this.psbComponent.directiveRef.geometry();
    const messageHeight = this.messageComponents.last.nativeElement
      .clientHeight;
    const chatboxHeight = this.elementRef.nativeElement.clientHeight;
    // TODO broken lint rule T45841
    return (
      toNumber(geometry.y) +
        toNumber(messageHeight) +
        toNumber(chatboxHeight) >=
      geometry.h
    );
  }

  handleScrollAtBottom() {
    this.showNewMessageFloatingAction = false;
  }

  identifyMessage(index: number, message: Message): number | undefined {
    return message.id || message.clientMessageId;
  }

  handleLoadMessages() {
    this.loadMoreMessages.emit(true);
  }
}
