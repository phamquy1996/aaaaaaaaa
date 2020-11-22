import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-toast-container',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./toast-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {}
