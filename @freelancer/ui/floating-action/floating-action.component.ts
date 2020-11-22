import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { SpinnerColor, SpinnerSize } from '@freelancer/ui/spinner';
import {
  FontColor,
  FontWeight,
  TextSize,
  TextTransform,
} from '@freelancer/ui/text';

@Component({
  selector: 'fl-floating-action',
  template: `
    <fl-bit
      class="FloatingAction"
      [ngClass]="{ 'FloatingAction--withIcon': icon }"
      [attr.disabled]="busy"
    >
      <fl-bit class="FloatingAction-inner">
        <fl-bit
          class="FloatingAction-icon"
          *ngIf="icon"
          [flMarginRight]="Margin.XXXSMALL"
        >
          <fl-icon
            [name]="icon"
            [color]="IconColor.LIGHT"
            [size]="IconSize.SMALL"
          ></fl-icon>
        </fl-bit>
        <fl-text
          class="FloatingAction-text"
          [color]="FontColor.LIGHT"
          [size]="TextSize.XXXSMALL"
          [textTransform]="TextTransform.UPPERCASE"
          [weight]="FontWeight.BOLD"
        >
          {{ text }}
        </fl-text>
      </fl-bit>

      <fl-spinner
        *ngIf="busy"
        class="FloatingAction-spinner"
        [size]="SpinnerSize.SMALL"
        [color]="SpinnerColor.LIGHT"
      ></fl-spinner>
    </fl-bit>
  `,
  styleUrls: ['./floating-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingActionComponent {
  FontColor = FontColor;
  TextSize = TextSize;
  FontWeight = FontWeight;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  TextTransform = TextTransform;
  SpinnerColor = SpinnerColor;
  SpinnerSize = SpinnerSize;

  @Input() icon: string;
  @Input() text: string;
  @HostBinding('attr.data-busy')
  @Input()
  busy?: boolean;

  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.aria-live') ariaLive = 'assertive';
}
