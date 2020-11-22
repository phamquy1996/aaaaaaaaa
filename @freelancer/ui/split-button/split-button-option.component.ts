import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { IconSize } from '@freelancer/ui/icon';
import {
  LinkColor,
  LinkHoverColor,
  LinkUnderline,
  QueryParams,
} from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { TextSize } from '@freelancer/ui/text';
import { SplitButtonOption } from './split-button.component';

@Component({
  selector: 'fl-split-button-option',
  template: `
    <fl-text *ngIf="!link" [size]="fontSize">
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </fl-text>

    <fl-link
      *ngIf="link"
      [color]="LinkColor.INHERIT"
      [hoverColor]="LinkHoverColor.INHERIT"
      [link]="link"
      [queryParams]="linkQueryParams"
      [size]="fontSize"
      [underline]="LinkUnderline.NEVER"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </fl-link>
    <ng-template #content>
      <fl-list-item
        [clickable]="true"
        [type]="ListItemType.NON_BORDERED"
        [padding]="optionPadding"
        (click)="handleOptionClicked($event)"
      >
        <fl-bit class="OptionListItem">
          <fl-icon
            *ngIf="iconName"
            [name]="iconName"
            [size]="iconSize"
            [flMarginRight]="Margin.XXSMALL"
          ></fl-icon>
          {{ copy }}
        </fl-bit>
      </fl-list-item>
    </ng-template>
  `,
  styleUrls: ['./split-button-option.component.scss'],
})
export class SplitButtonOptionComponent {
  LinkColor = LinkColor;
  LinkHoverColor = LinkHoverColor;
  LinkUnderline = LinkUnderline;
  ListItemType = ListItemType;
  Margin = Margin;

  @Input() fontSize?: TextSize;
  @Input() iconSize = IconSize.MID;
  @Input() optionPadding?: ListItemPadding;
  @Input() link?: string;
  @Input() linkQueryParams: QueryParams;
  @Input() iconName: string;
  @Input() copy: string;

  @HostBinding('attr.role') ariaRole = 'listitem';

  @Output() optionSelected = new EventEmitter<SplitButtonOption>();

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  handleOptionClicked(event: MouseEvent) {
    event.stopPropagation();

    this.optionSelected.emit({
      copy: this.copy,
      link: this.link,
      linkQueryParams: this.linkQueryParams,
      iconName: this.iconName,
    });
  }
}
