import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { PortfolioItem } from '@freelancer/datastore/collections';
import { Sounds } from '@freelancer/sounds';
import { HeadingColor, HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-audio-item',
  template: `
    <fl-bit class="AudioItem">
      <fl-bit
        *ngFor="let audioItem of portfolioItem.files"
        class="AudioItem-content"
      >
        <ng-container *ngIf="canPlayAudio; else noAudio">
          <fl-bit [flMarginBottom]="Margin.SMALL">
            <audio
              class="AudioItem-content-audio"
              controls
              src="{{ audioItem.cdnUrl }}"
            ></audio>
          </fl-bit>
          <fl-text
            i18n="Portolio item audio label"
            [color]="FontColor.LIGHT"
            [flMarginBottom]="Margin.SMALL"
          >
            Press play to listen to {{ audioItem.filename }}
          </fl-text>
        </ng-container>
        <ng-template #noAudio>
          <fl-text
            i18n="Portolio item audio not supported label"
            [color]="FontColor.LIGHT"
            [flMarginBottom]="Margin.MID"
          >
            Your browser cannot play the audio file, click
            <fl-link
              flTrackingLabel="AudioNotSupportedLink"
              [link]="audioItem.cdnUrl"
            >
              here
            </fl-link>
            to download it.
          </fl-text>
        </ng-template>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./audio-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioItemComponent implements OnInit {
  HeadingColor = HeadingColor;
  HeadingType = HeadingType;
  TextSize = TextSize;
  FontColor = FontColor;
  Margin = Margin;

  @Input() portfolioItem: PortfolioItem;
  canPlayAudio = true;

  constructor(private sounds: Sounds) {}

  ngOnInit() {
    this.canPlayAudio = this.sounds.isAudioCapable();
  }
}
