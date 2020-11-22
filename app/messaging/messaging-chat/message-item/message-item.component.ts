import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  Message,
  MessageSendStatus,
  RichMessage,
  RichMessageType,
  User,
} from '@freelancer/datastore/collections';
import { HoverColor, IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, HighlightColor } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { isDefined, toNumber } from '@freelancer/utils';
import { UsersTypingMap } from '../chat-box/chat-box.component';

interface ReadMarker {
  user: User;
  time: number;
}

@Component({
  selector: 'app-message-item',
  template: `
    <ng-container *ngIf="shouldRender">
      <!-- date pipe can return null, so we have to || it with empty string -->
      <fl-bit *ngIf="isTimestamp" class="Timestamp">{{
        (message.timeCreated | date: 'dd MMM yyyy &middot; h:mm a') || ''
          | uppercase
      }}</fl-bit>
      <fl-bit
        *ngIf="isFirst && !fromMe && otherMembers?.length > 1"
        class="Username"
      >
        {{ author?.displayName }}
      </fl-bit>

      <fl-bit
        class="Message"
        *ngIf="!message.richMessage"
        [ngClass]="{
          'Message--hasName': isFirst && !fromMe && otherMembers?.length > 1
        }"
        data-uitest-target="chat-messages"
      >
        <fl-bit
          class="AvatarContainer"
          [ngClass]="{ 'AvatarContainer--other': !fromMe }"
        >
          <fl-user-avatar
            *ngIf="author !== undefined && hasUserImg"
            [users]="[author]"
            [size]="AvatarSize.SMALL"
            [attr.title]="author?.displayName"
            [flMarginRight]="Margin.XXXSMALL"
          ></fl-user-avatar>
        </fl-bit>
        <fl-bit *ngIf="fromMe" class="ResendButtonContainer">
          <fl-button
            *ngIf="failed"
            [flMarginRight]="Margin.XXXSMALL"
            class="ResendButton"
            flTrackingLabel="resendButton"
            (click)="handleResend($event)"
          >
            <fl-icon
              [color]="IconColor.DARK"
              [size]="IconSize.SMALL"
              [hoverColor]="HoverColor.PRIMARY"
              name="ui-refresh"
              i18n-label="Chatbox message retry label"
              label="Retry"
            ></fl-icon>
          </fl-button>
        </fl-bit>
        <fl-bit
          class="MessageBody"
          [ngClass]="{
            'MessageBody--failed': fromMe && failed,
            'MessageBody--unsent': fromMe && sending,
            'MessageBody--mine': fromMe,
            'MessageBody--other': !fromMe,
            'MessageBody--first': isFirst,
            'MessageBody--mid': !isFirst && !isLast,
            'MessageBody--last': isLast,
            'MessageBody--solo': isFirst && isLast
          }"
        >
          <fl-tooltip
            class="MessageContainer"
            [message]="
              message.timeCreated | date: 'dd MMM yyyy &middot; h:mm a' || ''
            "
          >
            <fl-interactive-text
              class="MessageText"
              [content]="message.message"
              [emoji]="true"
              [link]="true"
              [fontColor]="fromMe ? FontColor.LIGHT : FontColor.DARK"
              [highlightColor]="HighlightColor.BLUE"
              [linkColor]="fromMe ? LinkColor.LIGHT : LinkColor.DEFAULT"
              data-uitest-target="chatbox-thread-message"
            >
            </fl-interactive-text>
            <app-message-attachment
              class="MessageAttachmentContainer"
              *ngFor="
                let attachment of message.attachments;
                trackBy: identifyAttachment
              "
              [attachment]="attachment"
              [messageId]="message.id"
              [fromMe]="fromMe"
              [chatBoxMode]="chatBoxMode"
              [useThumbnailService]="useThumbnailService"
            ></app-message-attachment>
          </fl-tooltip>
        </fl-bit>
      </fl-bit>
      <fl-bit
        *ngIf="isLastFailed"
        class="FailedMessage"
        i18n="Chatbox message error item"
      >
        Message not delivered.
      </fl-bit>

      <app-rich-message
        *ngIf="
          message.richMessage &&
          !getSupportedRichMessageType(message.richMessage)
        "
        [richMessage]="message.richMessage"
        [messageId]="message.id"
        [currentUserId]="currentUserId"
      ></app-rich-message>

      <ng-container
        *ngIf="
          message.richMessage &&
            getSupportedRichMessageType(message.richMessage);
          let richMessageType
        "
      >
        <app-share-job
          *ngIf="
            richMessageType.type === 'share_project' ||
            richMessageType.type === 'share_contest'
          "
          [jobId]="
            richMessageType.type === 'share_project'
              ? richMessageType.metadata.project_id
              : richMessageType.metadata.contest_id
          "
          [type]="richMessageType.type"
          [fromMe]="richMessageFromMe"
        ></app-share-job>
      </ng-container>

      <fl-bit class="ReadMarkersContainer" *ngIf="readMarkers.length > 0">
        <app-read-marker
          *ngFor="let rm of readMarkers; trackBy: identifyReadMarker"
          [user]="rm.user"
          [time]="rm.time"
          [isTyping]="usersTyping[rm.user.id] | async"
        ></app-read-marker>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageItemComponent implements OnChanges, OnInit {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  HighlightColor = HighlightColor;
  HoverColor = HoverColor;
  IconColor = IconColor;
  IconSize = IconSize;
  LinkColor = LinkColor;
  Margin = Margin;
  TooltipPosition = TooltipPosition;

  @Input() otherMembers: ReadonlyArray<User>;
  @Input() threadMembers: ReadonlyArray<User>;
  @Input() userReadTimes: { [key: number]: number };
  @Input() message: Message;
  @Input() after?: Message;
  @Input() before?: Message;
  @Input() currentUserId: string;
  @Input() chatBoxMode = true;
  @Input() usersTyping: UsersTypingMap;
  @Input() useThumbnailService = false;
  @Output()
  resendMessage = new EventEmitter<Message>();

  @HostBinding('class.IsRichMessage') isRichMessage = false;
  readMarkers: ReadonlyArray<ReadMarker> = [];

  private readonly supportedRichMessageType: ReadonlyArray<string> = [
    'share_project',
    'share_contest',
  ];

  hasUserImg: boolean;
  isTimestamp: boolean;
  isFirst: boolean;
  isLast: boolean;
  fromMe: boolean;
  sent: boolean;
  sending: boolean;
  failed: boolean;
  isLastFailed: boolean;
  shouldRender?: boolean;
  author: User | undefined = undefined;
  options: ReadonlyArray<string> = ['Resend', 'Resend All', 'Remove'];
  richMessageFromMe: boolean;

  ngOnInit() {
    if (this.message.richMessage) {
      this.isRichMessage = this.message.richMessage !== undefined;
    }
    this.updateMessageAttributes();
  }

  ngOnChanges() {
    this.updateMessageAttributes();
  }

  getAuthor(): User | undefined {
    return this.threadMembers
      ? this.threadMembers.find(u => u.id === this.message.fromUser)
      : undefined;
  }

  differentAuthor(m: Message): boolean {
    return this.message.fromUser !== m.fromUser;
  }

  shouldShowTimestamp(m1: Message, m2: Message): boolean {
    // If the last message (m) is four hours older than this one
    return m1.timeCreated - m2.timeCreated > 4 * 60 * 60 * 1000;
  }

  updateMessageAttributes() {
    this.fromMe = this.message.fromUser === Number(this.currentUserId);
    this.richMessageFromMe =
      isDefined(this.message.richMessage) &&
      isDefined(this.message.richMessage.fromUser) &&
      this.message.richMessage.fromUser === toNumber(this.currentUserId);
    this.isTimestamp =
      !this.before || this.shouldShowTimestamp(this.message, this.before);
    this.isFirst =
      !this.before || this.differentAuthor(this.before) || this.isTimestamp;
    this.isLast =
      !this.after ||
      this.differentAuthor(this.after) ||
      this.shouldShowTimestamp(this.after, this.message);
    this.hasUserImg = !this.fromMe && this.isLast;
    this.sent = this.message.messageId !== undefined;
    this.sent = this.message.sendStatus === MessageSendStatus.SENT;
    this.sending = this.message.sendStatus === MessageSendStatus.SENDING;
    this.failed =
      this.fromMe && this.message.sendStatus === MessageSendStatus.FAILED;
    this.isLastFailed =
      this.failed &&
      (!this.after || this.after.sendStatus !== MessageSendStatus.FAILED);
    const isInvisibleRichMessage =
      this.message.richMessage &&
      this.message.richMessage.long.length === 0 &&
      this.message.richMessage.short.length === 0;
    this.shouldRender = !isInvisibleRichMessage;

    if (this.otherMembers && this.userReadTimes) {
      this.readMarkers = this.otherMembers
        .filter(om => {
          const readTime = this.userReadTimes[om.id];
          return (
            readTime >= this.message.timeCreated &&
            (!this.after || readTime < this.after.timeCreated)
          );
        })
        .map(om => ({ time: this.userReadTimes[om.id], user: om }));
    }
    this.author = this.getAuthor();
  }

  handleResend($event: Event) {
    $event.stopPropagation(); // some error if removing this
    this.resendMessage.emit(this.message);
  }

  identifyAttachment(index: number, attachment: File) {
    return attachment.name;
  }

  identifyReadMarker(index: number, readMarker: ReadMarker) {
    return `${readMarker.user.id}${readMarker.time}`;
  }

  getSupportedRichMessageType(
    richMessage: RichMessage,
  ): RichMessageType | undefined {
    if (!richMessage.types) {
      return undefined;
    }

    return richMessage.types.find(richMessageType =>
      this.supportedRichMessageType.includes(richMessageType.type),
    );
  }
}
