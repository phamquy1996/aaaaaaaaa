import { Component, HostBinding, Input } from '@angular/core';

export enum HorizontalAlignment {
  HORIZONTAL_CENTER = 'center',
  HORIZONTAL_RIGHT = 'right',
}

export enum VerticalAlignment {
  VERTICAL_BOTTOM = 'bottom',
  VERTICAL_CENTER = 'center',
  VERTICAL_STRETCH = 'stretch',
}

@Component({
  selector: 'fl-grid',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
  @HostBinding('attr.data-horizontal-alignment')
  @Input()
  hAlign?: HorizontalAlignment;
  @HostBinding('attr.data-vertical-alignment')
  @Input()
  vAlign?: VerticalAlignment;

  /** Forces the columns into one row */
  @HostBinding('attr.data-overflow')
  @Input()
  overflow = false;
}
