import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';
import { trackByValue } from '@freelancer/ui/helpers';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { IconColor, IconSize } from '../icon/icon.component';

@Component({
  selector: 'fl-earnings',
  template: `
    <ng-container *ngIf="!compact">
      <ng-container *ngIf="!flipValue">
        <ng-container *ngTemplateOutlet="earningsText"></ng-container>
      </ng-container>
      <fl-icon
        class="DollarIcon"
        [name]="'ui-dollar'"
        [size]="size"
        [color]="IconColor.INHERIT"
      ></fl-icon>

      <fl-bit
        class="ValueBlock"
        *ngFor="let block of blocks; trackBy: trackByValue"
        [ngStyle]="{ background: block }"
        [attr.data-icon-size]="size"
      ></fl-bit>
      <fl-bit *ngIf="flipValue" class="RightEarningsText">
        <ng-container *ngTemplateOutlet="earningsText"></ng-container>
      </fl-bit>
    </ng-container>
    <ng-container *ngIf="compact">
      <fl-icon
        class="DollarIcon"
        [name]="'ui-dollar'"
        [size]="size"
        [color]="IconColor.INHERIT"
        [flMarginRight]="Margin.XXXSMALL"
      ></fl-icon>
      <ng-container *ngTemplateOutlet="earningsText"></ng-container>
    </ng-container>
    <ng-template #earningsText>
      <fl-text
        class="EarningsText"
        [size]="size === IconSize.MID ? TextSize.SMALL : TextSize.XXSMALL"
        [color]="FontColor.DARK"
        [attr.data-icon-size]="size"
      >
        {{ earnings | number: '1.1-1' }}
      </fl-text>
    </ng-template>
  `,
  styleUrls: ['./earnings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarningsComponent implements OnChanges {
  IconColor = IconColor;
  IconSize = IconSize;
  TextSize = TextSize;
  FontColor = FontColor;
  Margin = Margin;
  trackByValue = trackByValue;

  blocks: string[] = [];
  @Input() compact = false;
  @Input() earnings: number;
  /**
   * If flipValue=true, earnings component value is on the right side
   * Else, earnings component value is on the left side
   */
  @Input() flipValue = false;

  @HostBinding('attr.data-icon-size')
  @Input()
  size = IconSize.SMALL;

  ngOnChanges() {
    if (!this.compact) {
      const boundEarnings = Math.max(Math.min(this.earnings, 10), 0);
      this.blocks = [];
      for (let i = 1; i <= 10; i++) {
        const value =
          i < boundEarnings ? 1 : Math.max(boundEarnings - i + 1, 0);
        // #bec0c2 is hardcoded here, in place of $neutral-xxlight
        const style = `linear-gradient(to right, currentColor ${value *
          100}%, #bec0c2 ${value * 100}%)`;
        this.blocks.push(style);
      }
    }
  }
}
