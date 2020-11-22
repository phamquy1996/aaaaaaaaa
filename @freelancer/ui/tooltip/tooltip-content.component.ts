import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { TooltipPosition, TooltipSize } from './tooltip.component';

@Component({
  selector: 'fl-tooltip-content',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./tooltip-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipContentComponent {
  @Input()
  @HostBinding('attr.data-position')
  position = TooltipPosition.BOTTOM_CENTER;
  @Input()
  @HostBinding('attr.data-size')
  size = TooltipSize.MID;
}
