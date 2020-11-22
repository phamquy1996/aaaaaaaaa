import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HoverColor, IconColor } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';

@Component({
  selector: 'app-messaging-typing-box',
  template: `
    <fl-icon
      [flMarginRight]="Margin.XXSMALL"
      [name]="'ui-attachment'"
      [hoverColor]="HoverColor.PRIMARY"
    ></fl-icon>
    <fl-textarea
      class="TypingBox-input"
      flTrackingLabel="MessagingTypingBox"
      placeholder="Type a message"
      i18n-placeholder="Type a message text"
      [flAutoGrow]="messageControl"
      [flAutoGrowMaxHeight]="INPUT_MAX_HEIGHT"
      [flMarginRight]="Margin.XXSMALL"
      [control]="messageControl"
      [rows]="1"
    ></fl-textarea>
    <fl-emoji-picker
      [flMarginRight]="Margin.XXSMALL"
      (emojiPicked)="handleEmojiPicked($event)"
    ></fl-emoji-picker>
    <!-- FIXME: T211630 Should be send icon, hover backdrop should be blue -->
    <fl-icon
      [name]="'ui-trophy'"
      [clickable]="true"
      [color]="IconColor.MID"
    ></fl-icon>
  `,
  styleUrls: ['./messaging-typing-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagingTypingBoxComponent {
  HoverColor = HoverColor;
  IconColor = IconColor;
  Margin = Margin;

  readonly INPUT_MAX_HEIGHT = 72;

  messageControl = new FormControl();

  handleEmojiPicked(emoji: string) {
    const currentMessage = this.messageControl.value;
    // FIXME: T211631 Should append the emoji wrt to the cursor position
    this.messageControl.setValue(
      currentMessage ? `${currentMessage} ${emoji}` : emoji,
    );
  }
}
