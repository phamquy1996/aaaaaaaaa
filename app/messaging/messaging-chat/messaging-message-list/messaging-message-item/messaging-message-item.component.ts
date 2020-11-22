import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Message, User } from '@freelancer/datastore/collections';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontWeight,
  HighlightColor,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { AvatarSize } from '@freelancer/ui/user-avatar';
import { MessageAttachment } from '../../messaging-attachment-modal/messaging-attachment-modal.component';

@Component({
  selector: 'app-messaging-message-item',
  template: `
    <fl-bit *ngIf="showDateDivider" [flMarginBottom]="Margin.XSMALL">
      <fl-text
        [flMarginBottom]="Margin.XXXSMALL"
        [color]="FontColor.MID"
        [highlightColor]="HighlightColor.BLUE"
        [size]="TextSize.XXSMALL"
        [textTransform]="TextTransform.UPPERCASE"
      >
        {{ message.timeCreated | date: 'MMM dd, yyyy' }}
      </fl-text>
      <fl-hr></fl-hr>
    </fl-bit>
    <fl-tooltip
      i18n-message="Message timestamp"
      message="{{ message.timeCreated | date: 'MMM dd, yyyy • h:mm a' }}"
      [position]="TooltipPosition.BOTTOM_CENTER"
    >
      <fl-bit class="Message-item">
        <fl-user-avatar
          [ngClass]="{ IsHidden: !showUserHeader }"
          [flMarginRight]="Margin.XSMALL"
          [size]="avatarSize"
          [users]="[user]"
          [isOnline]="userIsOnline"
        ></fl-user-avatar>
        <fl-bit>
          <fl-bit *ngIf="showUserHeader" class="Message-item-header">
            <fl-text
              [flMarginRight]="Margin.XXXSMALL"
              [highlightColor]="HighlightColor.BLUE"
              [weight]="FontWeight.MEDIUM"
            >
              {{ user?.displayName }}
            </fl-text>
            <fl-text
              [color]="FontColor.MID"
              [highlightColor]="HighlightColor.BLUE"
              [size]="TextSize.XXSMALL"
            >
              {{ message.timeCreated | date: 'h:mm a' }}
            </fl-text>
          </fl-bit>
          <fl-interactive-text
            [content]="message.message"
            [emoji]="true"
            [link]="true"
            [fontColor]="FontColor.DARK"
            [fontSize]="TextSize.XSMALL"
            [highlightColor]="HighlightColor.BLUE"
          >
          </fl-interactive-text>
          <app-messaging-message-attachment
            *ngFor="
              let attachment of message.attachments;
              trackBy: identifyAttachment
            "
            [attachment]="attachment"
            [messageId]="message.id"
            (viewAttachment)="viewAttachment.emit($event)"
          ></app-messaging-message-attachment>
        </fl-bit>
      </fl-bit>
    </fl-tooltip>
  `,
  styleUrls: ['./messaging-message-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingMessageItemComponent implements OnChanges {
  AvatarSize = AvatarSize;
  FontColor = FontColor;
  FontWeight = FontWeight;
  HighlightColor = HighlightColor;
  Margin = Margin;
  TextSize = TextSize;
  TextTransform = TextTransform;
  TooltipPosition = TooltipPosition;

  @Input() avatarSize: AvatarSize = AvatarSize.SMALL;
  @Input() message: Message;
  @Input() previousMessage?: Message;
  @Input() user?: User;
  @Input() userIsOnline?: boolean;
  @Output() viewAttachment = new EventEmitter<MessageAttachment>();

  showDateDivider = false;
  showUserHeader = true;

  checkIfSameDate(date1: number, date2: number): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('message' in changes || 'previousMessage' in changes) {
      this.showDateDivider =
        !this.previousMessage ||
        !this.checkIfSameDate(
          this.message.timeCreated,
          this.previousMessage.timeCreated,
        );
      this.showUserHeader =
        !this.previousMessage ||
        this.previousMessage.fromUser !== this.message.fromUser ||
        this.message.timeCreated - this.previousMessage.timeCreated >
          4 * 60 * 60 * 1000;
    }
  }

  identifyAttachment(index: number, attachment: string) {
    return attachment;
  }
}
