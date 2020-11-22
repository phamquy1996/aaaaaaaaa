import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export enum ContainerSize {
  TABLET = 'tablet',
  DESKTOP_SMALL = 'desktop-small',
  DESKTOP_LARGE = 'desktop-large',
  DESKTOP_XLARGE = 'desktop-xlarge',
  FLUID = 'fluid',
}

@Component({
  selector: 'fl-container',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  @HostBinding('attr.size')
  @Input()
  size: ContainerSize = ContainerSize.DESKTOP_LARGE;
}
