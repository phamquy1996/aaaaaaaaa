import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'fl-label',
  template: `
    <fl-text
      [fontType]="FontType.SPAN"
      [color]="color"
      [size]="size"
      [sizeTablet]="sizeTablet"
      [sizeDesktop]="sizeDesktop"
      [weight]="weight"
    >
      <label [attr.for]="for"> <ng-content></ng-content> </label>
    </fl-text>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;

  /** This is for accessibility. ID of the input that this label is associated */
  @Input() for: string;
  @Input() size: TextSize = TextSize.XSMALL;
  @Input() sizeTablet?: TextSize;
  @Input() sizeDesktop?: TextSize;
  @Input() weight = FontWeight.NORMAL;
  @Input() color = FontColor.DARK;
}
