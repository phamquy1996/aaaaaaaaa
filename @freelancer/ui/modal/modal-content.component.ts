import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fl-modal-content',
  template: `
    <div>THIS IS A SCROLLING CONTAINER</div>
    <div><ng-content></ng-content></div>
    <div>OR WHATHER</div>
  `,
  styleUrls: ['./modal-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContentComponent {}
