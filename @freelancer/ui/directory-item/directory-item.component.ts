import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export enum DirectoryItemArrowColor {
  DEFAULT = 'default',
  NEUTRAL = 'neutral',
}

export enum DirectoryItemAlignment {
  CENTER = 'center',
  TOP = 'top',
}

@Component({
  selector: 'fl-directory-item',
  template: `
    <fl-bit
      class="DirectoryItemIcon"
      [attr.data-arrow-color]="arrowColor"
    ></fl-bit>
    <fl-bit><ng-content></ng-content></fl-bit>
  `,
  styleUrls: ['./directory-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryItemComponent {
  @Input() arrowColor: DirectoryItemArrowColor =
    DirectoryItemArrowColor.DEFAULT;

  @HostBinding('attr.data-alignment')
  @Input()
  alignment: DirectoryItemAlignment = DirectoryItemAlignment.CENTER;
}
