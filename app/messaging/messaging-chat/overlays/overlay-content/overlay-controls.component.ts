import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-overlay-controls',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./overlay-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayControlsComponent {}
