import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import {
  FontColor,
  FontType,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';

export enum TagStatusColor {
  DEFAULT = 'default',
  BLUE = 'blue',
  GREEN = 'green',
  ORANGE = 'orange',
}

@Component({
  selector: 'fl-tag-status',
  template: `
    <fl-icon
      *ngIf="iconName"
      class="TagStatusIcon"
      [color]="IconColor.INHERIT"
      [flMarginRight]="Margin.XXSMALL"
      [name]="iconName"
      [size]="IconSize.SMALL"
    ></fl-icon>
    <fl-text
      [color]="FontColor.INHERIT"
      [fontType]="FontType.SPAN"
      [size]="TextSize.XSMALL"
      [textTransform]="TextTransform.CAPITALIZE"
      [weight]="FontWeight.BOLD"
    >
      <ng-content></ng-content>
    </fl-text>
  `,
  styleUrls: ['./tag-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagStatusComponent {
  FontColor = FontColor;
  FontType = FontType;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  TextSize = TextSize;
  TextTransform = TextTransform;
  Margin = Margin;

  @HostBinding('attr.data-color')
  @Input()
  color: TagStatusColor = TagStatusColor.DEFAULT;

  @Input() iconName?: string;
}
