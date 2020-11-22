import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import { trackByValue } from '@freelancer/ui/helpers';

@Component({
  selector: 'fl-loading-text',
  template: `
    <fl-bit class="BackgroundShimmer" flHideInEnd2EndTests>
      <ng-container *ngFor="let bar of bars; trackBy: trackByValue">
        <fl-bit class="LoadingBarRightMask"></fl-bit>
        <!-- only need gaps between bars -->
        <fl-bit class="LoadingBarRowMask"></fl-bit>
      </ng-container>
    </fl-bit>
  `,
  styleUrls: ['./loading-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingTextComponent implements OnChanges {
  trackByValue = trackByValue;

  readonly BAR_HEIGHT = 28;

  bars: number[] = [];

  @HostBinding('class.Padded')
  @Input()
  padded = true;

  /** Height in pixels of the loading text block. Not compatible with rows. */
  @Input() height: number;
  /** Number of rows of loading text to display. Not compatible with height. */
  @Input() rows: number;

  ngOnChanges() {
    this.bars = this.height
      ? Array.from({ length: this.height / this.BAR_HEIGHT }, (v, i) => i)
      : Array.from({ length: this.rows }, (v, i) => i);
  }
}
