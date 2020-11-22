import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { LinkColor, LinkUnderline, QueryParams } from '@freelancer/ui/link';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';

export enum TagSize {
  SMALL = 'small',
  MID = 'mid',
}

export enum TagType {
  CLICKABLE = 'clickable',
  DEFAULT = 'default',
  DISMISSABLE = 'dismissable',
}

@Component({
  selector: 'fl-tag',
  template: `
    <fl-link
      *ngIf="link"
      class="Tag"
      [attr.data-tag-size]="size"
      [attr.data-tag-type]="attrType"
      [color]="LinkColor.INHERIT"
      [link]="link"
      [newTab]="newTab"
      [queryParams]="queryParams"
      [underline]="LinkUnderline.NEVER"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </fl-link>

    <fl-bit
      class="Tag"
      *ngIf="!link"
      [ngClass]="{ IsSelected: selected }"
      [attr.data-tag-size]="size"
      [attr.data-tag-type]="attrType"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </fl-bit>

    <ng-template #content>
      <fl-text
        class="Content"
        [flMarginRight]="
          attrType === TagType.DISMISSABLE ? Margin.XXSMALL : Margin.NONE
        "
        [fontType]="FontType.SPAN"
        [color]="FontColor.INHERIT"
        [size]="size === TagSize.MID ? TextSize.XXSMALL : TextSize.XXXSMALL"
      >
        <ng-content></ng-content>
      </fl-text>
      <!-- hacky use of fl-picture to get a 8px close icon -->
      <fl-picture
        class="CloseIcon"
        *ngIf="attrType === TagType.DISMISSABLE"
        title="Remove"
        i18n-title="Remove tag button"
        alt="Dismiss"
        i18n-alt="Tag dismiss alt"
        [src]="'icons/ui-close.svg'"
        [fullWidth]="true"
        (click)="handleDismiss($event)"
      ></fl-picture>
    </ng-template>
  `,
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent implements OnChanges {
  FontColor = FontColor;
  TextSize = TextSize;
  FontType = FontType;
  LinkColor = LinkColor;
  LinkUnderline = LinkUnderline;
  Margin = Margin;
  TagSize = TagSize;
  TagType = TagType;

  /**
   * Used for styling purposes only so we don't need to
   * override the [type] input when [link] is provided
   */
  attrType: TagType;

  @Input() link?: string;
  @Input() newTab?: boolean;
  @Input() queryParams?: QueryParams;
  @Input() type = TagType.DEFAULT;
  @Input() selected = false;

  @HostBinding('attr.data-tag-size')
  @Input()
  size = TagSize.MID;

  @Output() dismiss = new EventEmitter<void>();

  ngOnChanges() {
    if (this.link) {
      this.attrType = TagType.CLICKABLE;
    } else {
      this.attrType = this.type;
    }
  }

  handleDismiss(event: Event) {
    event.stopPropagation();
    this.dismiss.next();
  }
}
