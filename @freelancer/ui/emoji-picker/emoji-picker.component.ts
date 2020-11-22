import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { trackByValue } from '@freelancer/ui/helpers';
import { EmojiSize } from '../emoji/emoji.component';
import { emojiLongnameList } from '../emoji/map';
import { HoverColor, IconColor, IconSize } from '../icon/icon.component';

// Only support subset of values
export type EmojiPickerSizeType = IconSize.SMALL | IconSize.MID;

@Component({
  selector: 'fl-emoji-picker',
  template: `
    <fl-button
      flTrackingLabel="emojiPicker"
      (click)="handleEmojiButtonClick()"
      data-uitest-target="emojipicker-button"
      [disabled]="disabled"
    >
      <fl-icon
        [color]="disabled ? IconColor.MID : IconColor.DARK"
        [size]="pickerSize"
        [hoverColor]="HoverColor.PRIMARY"
        name="ui-smile"
        label="Pick an emoji"
      ></fl-icon>
    </fl-button>

    <fl-bit
      *ngIf="emojiPickerIsOpen"
      class="EmojiPicker-card"
      data-uitest-target="emojipicker"
    >
      <fl-emoji
        *ngFor="let emojiName of emojiLongnameList; trackBy: trackByValue"
        class="EmojiPicker-item"
        [emoji]="emojiName"
        [size]="EmojiSize.SMALL"
        (click)="handleEmojiPick(emojiName)"
      ></fl-emoji>
    </fl-bit>
  `,
  styleUrls: ['./emoji-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiPickerComponent {
  EmojiSize = EmojiSize;
  IconColor = IconColor;
  IconSize = IconSize;
  HoverColor = HoverColor;
  trackByValue = trackByValue;

  @Input() disabled = false;
  @Input() pickerSize: EmojiPickerSizeType = IconSize.SMALL;

  @Output() emojiPicked = new EventEmitter<string>();

  emojiLongnameList = emojiLongnameList;
  emojiPickerIsOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClickOutsideEmojiPicker(event: MouseEvent) {
    if (
      this.emojiPickerIsOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.emojiPickerIsOpen = false;
    }
  }

  handleEmojiPick(emojiName: string) {
    this.emojiPickerIsOpen = false;
    this.emojiPicked.emit(emojiName);
  }

  handleEmojiButtonClick() {
    this.emojiPickerIsOpen = !this.emojiPickerIsOpen;
  }
}
