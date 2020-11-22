import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { QueryParams } from '@freelancer/ui/link';

@Component({
  selector: 'fl-split-button-primary',
  template: `
    <fl-button
      class="PrimaryButton"
      [color]="color"
      [display]="display"
      [link]="link"
      [queryParams]="linkQueryParams"
      [size]="size"
      [busy]="busy"
      [buttonGroupFirst]="buttonGroupFirst && !busy"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </fl-button>
  `,
  styleUrls: ['./split-button-primary.component.scss'],
})
export class SplitButtonPrimaryComponent {
  @Input() link: string;
  @Input() linkQueryParams: QueryParams;
  @Input() buttonGroupFirst: boolean;

  @Input() busy: boolean;
  @Input() size: ButtonSize;
  @Input() color: ButtonColor;

  @HostBinding('attr.data-display')
  @Input()
  display: 'block' | 'inline' = 'inline';

  @Output() primaryClicked = new EventEmitter<void>();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  handleClick(event: MouseEvent) {
    event.stopPropagation();

    this.primaryClicked.emit();
  }
}
