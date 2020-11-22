import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeadingType } from '@freelancer/ui/heading';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-hourly-award-heading',
  template: `
    <fl-heading
      [size]="TextSize.MID"
      [headingType]="HeadingType.H3"
      [flMarginBottom]="Margin.XXXSMALL"
    >
      {{ title }}
    </fl-heading>
    <fl-text [flMarginBottom]="Margin.LARGE">
      {{ subtitle }}
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HourlyAwardModalHeadingComponent {
  HeadingType = HeadingType;
  TextSize = TextSize;
  Margin = Margin;
  FontColor = FontColor;

  @Input() title: string;
  @Input() subtitle: string;
}
