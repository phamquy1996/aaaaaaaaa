import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'fl-annotation-indicator',
  template: `
    <fl-bit class="Indicator"></fl-bit>
  `,
  styleUrls: ['./annotation-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationIndicatorComponent {
  @HostBinding('attr.data-animating')
  @Input()
  isAnimating = true;
}
