import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HighlightColor } from '@freelancer/ui/text';
import { Assets } from '../assets';
import { emojiKeyToAltText, emojiKeyToImageMap } from './map';

export enum EmojiSize {
  SMALL = 'small',
  LARGE = 'large',
}

@Component({
  selector: 'fl-emoji',
  template: `
    <img
      [ngClass]="{
        BlueHighlight: highlightColor === HighlightColor.BLUE,
        GrayHighlight: highlightColor === HighlightColor.GRAY
      }"
      class="EmojiIcon"
      [attr.data-size]="size"
      [src]="src"
      [alt]="altText"
    />
  `,
  styleUrls: ['./emoji.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiComponent implements OnChanges {
  HighlightColor = HighlightColor;
  EmojiSize = EmojiSize;
  emojiKeyToImageMap = emojiKeyToImageMap;

  @Input() emoji: string;

  @Input() size: EmojiSize = EmojiSize.SMALL;
  @Input() highlightColor?: HighlightColor;

  src: string;
  altText: string;

  constructor(private assets: Assets) {}

  ngOnChanges(changes: SimpleChanges) {
    if ('emoji' in changes) {
      this.src = this.assets.getUrl(`emoji/${emojiKeyToImageMap[this.emoji]}`);
      this.altText = emojiKeyToAltText[this.emoji];
    }
  }
}
