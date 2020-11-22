import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-overlay-header',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./overlay-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayHeaderComponent {}
