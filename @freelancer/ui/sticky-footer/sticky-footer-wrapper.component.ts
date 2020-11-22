import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fl-sticky-footer-wrapper',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./sticky-footer-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StickyFooterWrapperComponent {}
