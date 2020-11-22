import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Location } from '@freelancer/location';
import { VerticalAlignment } from '@freelancer/ui/grid';
import { IconColor, IconSize } from '@freelancer/ui/icon';

export enum ViewHeaderBackground {
  DARK = 'dark',
  LIGHT = 'light',
  TRANSPARENT = 'transparent',
}

export enum ViewHeaderType {
  BACK = 'back',
  CLOSE = 'close',
}

@Component({
  selector: 'fl-view-header',
  template: `
    <fl-bit class="ViewHeaderContent" [attr.data-background]="background">
      <fl-bit class="ViewHeaderContent-inner">
        <fl-button
          *ngIf="showBackButton"
          class="ViewHeaderContent-action"
          [flShowMobile]="true"
          (click)="handleIconClick()"
        >
          <fl-icon
            [size]="IconSize.SMALL"
            [name]="type === 'back' ? 'ui-chevron-left' : 'ui-close'"
            [color]="IconColor.INHERIT"
          ></fl-icon>
        </fl-button>

        <fl-bit
          class="ViewHeaderContent-title"
          [ngClass]="{ 'ViewHeaderContent-title--indented': showBackButton }"
        >
          <ng-content></ng-content>
        </fl-bit>

        <fl-button
          *ngIf="showMenu"
          class="ViewHeaderContent-action"
          (click)="menuClick.emit()"
        >
          <fl-icon
            [name]="'ui-show-more'"
            [size]="IconSize.SMALL"
            [color]="IconColor.INHERIT"
          ></fl-icon>
        </fl-button>
      </fl-bit>
    </fl-bit>
  `,
  styleUrls: ['./view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewHeaderComponent {
  IconSize = IconSize;
  IconColor = IconColor;
  VerticalAlignment = VerticalAlignment;

  @Input() type = ViewHeaderType.BACK;
  @Input() showBackButton = true;
  @Input() showMenu = false;

  @HostBinding('attr.data-background')
  @Input()
  background = ViewHeaderBackground.LIGHT;

  @Output() menuClick = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(private location: Location) {}

  handleIconClick() {
    if (this.type === ViewHeaderType.BACK) {
      // TODO: handle route changes under one heading (eg. pvp tabs)
      this.location.back();
    } else {
      this.close.emit();
    }
  }
}
