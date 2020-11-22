import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'fl-progress-substep',
  template: `
    <fl-text
      [color]="FontColor.MID"
      [size]="TextSize.XSMALL"
      [fontType]="FontType.CONTAINER"
    >
      <ng-content></ng-content>
    </fl-text>
  `,
  styleUrls: ['./progress-substep.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSubstepComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;

  constructor(public elementRef: ElementRef) {}
}
