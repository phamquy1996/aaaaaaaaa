import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fl-modal-actions',
  template: `
    <div>
      - - - - - - - - - some dashed line - - - - - - - - - - or whatever - - - -
      -
    </div>
    <div>ACTIONS</div>
    <div><ng-content></ng-content></div>
    <div>
      - - - - - - - - - some dashed line - - - - - - - - - - or whatever - - - -
      -
    </div>
  `,
  styleUrls: ['./modal-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActionsComponent {}
