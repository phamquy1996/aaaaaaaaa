import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-overlay-controls-item',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./overlay-controls-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayControlsItemComponent {}
