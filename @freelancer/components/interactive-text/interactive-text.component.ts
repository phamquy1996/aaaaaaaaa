import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  emojiLongnameList,
  emojiShortnameList,
  EmojiSize,
} from '@freelancer/ui/emoji';
import { LinkColor, LinkHoverColor } from '@freelancer/ui/link';
import {
  FontColor,
  FontType,
  HighlightColor,
  TextSize,
} from '@freelancer/ui/text';

export enum ChunkType {
  EMOJI,
  TEXT,
}

export interface Chunk {
  type: ChunkType;
  content: string;
}

/**
 * A component for converting links and/or emojis within a text block into actual links/emojis.
 * Can take in (some) inputs that fl-text or fl-link can take in.
 */
@Component({
  selector: 'fl-interactive-text',
  template: `
    <span *ngFor="let chunk of chunks" [ngSwitch]="chunk.type">
      <fl-emoji
        *ngSwitchCase="ChunkType.EMOJI"
        [emoji]="chunk.content"
        [highlightColor]="highlightColor"
        [size]="EmojiSize.SMALL"
      ></fl-emoji>
      <ng-container *ngSwitchCase="ChunkType.TEXT">
        <ng-container *ngIf="link; else plainText">
          <fl-text
            *flAutoLink="
              true;
              color: linkColor;
              highlightColor: highlightColor;
              hoverColor: LinkHoverColor.INHERIT
            "
            [color]="fontColor"
            [displayLineBreaks]="true"
            [highlightColor]="highlightColor"
            [fontType]="FontType.SPAN"
            [size]="fontSize"
          >
            {{ chunk.content }}
          </fl-text>
        </ng-container>
        <ng-template #plainText>
          <fl-text
            [color]="fontColor"
            [displayLineBreaks]="true"
            [highlightColor]="highlightColor"
            [fontType]="FontType.SPAN"
            [size]="fontSize"
          >
            {{ chunk.content }}
          </fl-text>
        </ng-template>
      </ng-container>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InteractiveTextComponent implements OnChanges {
  ChunkType = ChunkType;
  EmojiSize = EmojiSize;
  FontColor = FontColor;
  FontType = FontType;
  TextSize = TextSize;
  LinkHoverColor = LinkHoverColor;

  @Input() content: string;
  @Input() highlightColor?: HighlightColor;
  @Input() linkColor: LinkColor = LinkColor.DEFAULT;
  @Input() fontColor: FontColor;
  @Input() fontSize: TextSize = TextSize.XXSMALL;

  @Input() link = false;
  @Input() emoji = false;

  chunks: Chunk[];

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes('content')) {
      const tempChunks = this.createChunks(
        this.content,
        this.emoji ? [...emojiShortnameList, ...emojiLongnameList] : [],
      );

      this.chunks = this.mergeTextChunks(tempChunks);
    }
  }

  createChunks(text: string, emojis: ReadonlyArray<string>): Chunk[] {
    return text.split(/(\s)/g).map(content => ({
      type: emojis.includes(content) ? ChunkType.EMOJI : ChunkType.TEXT,
      content,
    }));
  }

  mergeTextChunks(unmergedChunks: Chunk[]): Chunk[] {
    return unmergedChunks.reduce((chunks, chunk) => {
      if (
        chunk.type === ChunkType.TEXT &&
        chunks.length > 0 &&
        chunks[chunks.length - 1].type === ChunkType.TEXT
      ) {
        chunks[chunks.length - 1].content += chunk.content;
        return chunks;
      }

      return [...chunks, chunk];
    }, [] as Chunk[]);
  }
}
