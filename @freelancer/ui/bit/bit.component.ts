import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fl-bit',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./bit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitComponent {}
