import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { IconColor, IconSize } from '../icon/icon.component';

export type WorkedTimeSizeType = IconSize.SMALL | IconSize.MID;

@Component({
  selector: 'fl-worked-time',
  template: `
    <fl-icon
      class="DollarIcon"
      [name]="'ui-clock-v2'"
      [size]="size"
      [color]="IconColor.SUCCESS"
      [flMarginRight]="Margin.XXXSMALL"
    ></fl-icon>
    <fl-tooltip
      message="Hours of experience working on similar projects"
      i18n-message="Worked time tooltip message"
      [position]="position"
    >
      <fl-text
        class="WorkedTimeText"
        [size]="size === IconSize.MID ? TextSize.SMALL : TextSize.XXSMALL"
      >
        {{ time | number: '1.1-1' }}
      </fl-text>
    </fl-tooltip>
  `,
  styleUrls: ['./worked-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkedTimeComponent {
  IconColor = IconColor;
  IconSize = IconSize;
  TextSize = TextSize;
  FontColor = FontColor;
  Margin = Margin;

  @Input() time?: number;
  @Input() position = TooltipPosition.END_CENTER;
  @Input() size: WorkedTimeSizeType = IconSize.SMALL;
}
