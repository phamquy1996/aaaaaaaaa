import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-overlay-content',
  template: `
    <perfect-scrollbar class="ScrollbarContent" [config]="{}">
      <ng-content></ng-content>
    </perfect-scrollbar>
  `,
  styleUrls: ['./overlay-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayContentComponent {}
