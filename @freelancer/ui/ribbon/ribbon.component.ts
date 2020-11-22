import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { IconColor } from '@freelancer/ui/icon';
import { FontColor, FontType, FontWeight, TextSize } from '@freelancer/ui/text';

export enum RibbonPlacement {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum RibbonColor {
  PRIMARY = 'primary',
  PRIMARY_LIGHT = 'primary-light',
  SECONDARY = 'secondary',
  SECONDARY_DARK = 'secondary-dark',
  TERTIARY = 'tertiary',
  QUATERNARY = 'quaternary',
}

export enum RibbonOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

@Component({
  selector: 'fl-ribbon',
  template: `
    <fl-icon
      *ngIf="icon"
      [label]="iconLabel"
      [name]="icon"
      [color]="IconColor.WHITE"
    ></fl-icon>
    <fl-text
      [color]="FontColor.LIGHT"
      [fontType]="FontType.SPAN"
      [size]="TextSize.XXSMALL"
      [weight]="FontWeight.BOLD"
    >
      <ng-content></ng-content>
    </fl-text>
  `,
  styleUrls: ['./ribbon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RibbonComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  FontWeight = FontWeight;
  IconColor = IconColor;

  @Input() iconLabel?: string;

  @HostBinding('attr.data-color')
  @Input()
  color: RibbonColor = RibbonColor.PRIMARY;

  @HostBinding('attr.data-icon')
  @Input()
  icon?: string;

  @HostBinding('attr.data-orientation')
  @Input()
  orientation = RibbonOrientation.HORIZONTAL;

  @HostBinding('attr.data-placement')
  @Input()
  placement: RibbonPlacement = RibbonPlacement.RIGHT;
}
