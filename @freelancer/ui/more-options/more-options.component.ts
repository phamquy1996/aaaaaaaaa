import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  CalloutColor,
  CalloutComponent,
  CalloutPlacement,
} from '@freelancer/ui/callout';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor, LinkUnderline, QueryParams } from '@freelancer/ui/link';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

export type MoreOptionsIconColor = IconColor.LIGHT | IconColor.DARK;

export enum MoreOptionsIconType {
  DEFAULT = 'default',
  COG = 'cog',
}

export enum MoreOptionsSize {
  XSMALL = 'xsmall',
  SMALL = 'small',
  MID = 'mid',
}

@Component({
  selector: `fl-more-options-item`,
  template: `
    <fl-link
      class="ItemLink"
      [color]="LinkColor.INHERIT"
      [link]="link ? link : null"
      [queryParams]="queryParams"
      [newTab]="newTab"
      [underline]="LinkUnderline.NEVER"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </fl-link>
  `,
  styleUrls: ['./more-options-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoreOptionsItemComponent {
  LinkColor = LinkColor;
  LinkUnderline = LinkUnderline;

  @Input() link?: string;
  @Input() newTab?: boolean;
  @Input() queryParams?: QueryParams;

  @Output() itemSelected = new EventEmitter<void>();

  handleClick() {
    this.itemSelected.emit();
  }
}

@Component({
  selector: 'fl-more-options',
  template: `
    <fl-callout
      class="MoreOptions"
      [color]="calloutColor"
      [edgeToEdge]="true"
      [hideArrow]="true"
      [hideCloseButton]="true"
      [placement]="calloutPlacement"
      [mobileCloseButton]="false"
      (calloutOpen)="toggleState()"
      (calloutClose)="toggleState()"
    >
      <fl-callout-trigger>
        <fl-button
          title="More Options"
          i18n-title="More Options"
          class="MoreOptions-trigger"
          [ngClass]="{
            IsActive: isActive,
            IsDark: iconColor === IconColor.DARK
          }"
          [attr.data-trigger-size]="size"
        >
          <fl-icon
            [name]="iconName"
            [size]="IconSize.MID"
            [color]="iconColor"
          ></fl-icon>
        </fl-button>
      </fl-callout-trigger>

      <fl-callout-content>
        <fl-bit class="MoreOptions-content" [attr.data-color]="calloutColor">
          <ng-content></ng-content>
        </fl-bit>
      </fl-callout-content>
    </fl-callout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./more-options.component.scss'],
})
export class MoreOptionsComponent implements AfterContentInit, OnDestroy {
  CalloutPlacement = CalloutPlacement;
  IconSize = IconSize;
  IconColor = IconColor;
  MoreOptionsIconType = MoreOptionsIconType;

  iconName = 'ui-show-more-h';
  isActive = false;

  private subscriptions: ReadonlyArray<Rx.Subscription> = [];
  private itemsSubscription?: Rx.Subscription;

  @Input() iconColor: MoreOptionsIconColor = IconColor.DARK;
  @Input() calloutColor = CalloutColor.LIGHT;
  @Input() calloutPlacement = CalloutPlacement.BOTTOM;
  @Input() size = MoreOptionsSize.MID;

  @Input()
  set iconType(type: MoreOptionsIconType) {
    this.iconName =
      type === MoreOptionsIconType.COG ? 'ui-cog-v2' : 'ui-show-more-h';
  }

  @ViewChild(CalloutComponent)
  calloutComponent: CalloutComponent;

  @ContentChildren(MoreOptionsItemComponent)
  items: QueryList<MoreOptionsItemComponent>;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngAfterContentInit() {
    // Keep track of the changes to update subscription list
    this.itemsSubscription = this.items.changes
      .pipe(startWith(this.items.toArray()))
      .subscribe(() => {
        // Clear out all subscriptions to avoid duplicates
        this.clearSubscriptions();

        this.subscriptions = this.items.map((item: MoreOptionsItemComponent) =>
          // FIXME
          // eslint-disable-next-line rxjs/no-nested-subscribe
          item.itemSelected.subscribe(() => this.calloutComponent.close()),
        );
      });
  }

  toggleState() {
    this.isActive = !this.isActive;
  }

  private clearSubscriptions() {
    if (this.subscriptions) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  }

  ngOnDestroy() {
    this.clearSubscriptions();

    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }
}
