import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fl-modal-title',
  template: `
    <h1><ng-content></ng-content></h1>
    <div>
      - - - - - - - - - some dashed line - - - - - - - - - - or whatever - - - -
      -
    </div>
  `,
  styleUrls: ['./modal-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalTitleComponent {}
