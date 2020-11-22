import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { IconColor } from '@freelancer/ui/icon';

export enum SpinnerType {
  DEFAULT = 'default',
  HOURGLASS = 'hourglass',
}

export enum SpinnerSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
}

export enum SpinnerBackgroundColor {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum SpinnerColor {
  PRIMARY = 'primary',
  GRAY = 'gray',
  LIGHT = 'light',
}

@Component({
  selector: 'fl-spinner',
  template: `
    <fl-bit
      class="Spinner"
      role="presentation"
      [attr.data-color]="overlay ? SpinnerColor.PRIMARY : color"
      [attr.data-size]="size"
      [attr.data-type]="type"
    >
      <fl-icon
        *ngIf="type === SpinnerType.HOURGLASS"
        class="SpinnerIcon"
        [name]="'ui-hourglass'"
        [color]="IconColor.LIGHT"
      ></fl-icon>
    </fl-bit>
  `,
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  SpinnerColor = SpinnerColor;
  IconColor = IconColor;
  SpinnerType = SpinnerType;

  @Input() size: SpinnerSize = SpinnerSize.MID;
  @Input() color: SpinnerColor = SpinnerColor.PRIMARY;
  @Input() type: SpinnerType = SpinnerType.DEFAULT;

  @HostBinding('attr.data-background')
  @Input()
  backgroundColor: SpinnerBackgroundColor = SpinnerBackgroundColor.LIGHT;

  @HostBinding('class.Overlay')
  @Input()
  overlay = false;

  @HostBinding('class.IsModalOverlay')
  @Input()
  overlayForModal = false;
}
