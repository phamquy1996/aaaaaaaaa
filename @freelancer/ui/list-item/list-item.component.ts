import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import * as Rx from 'rxjs';

export enum ListItemType {
  NON_BORDERED = 'non_bordered',
  CHECKBOX = 'checkbox',
  DEFAULT = 'default',
  DISMISS = 'dismiss',
  RADIO = 'radio',
  TOGGLE = 'toggle',
  ORDERED = 'ordered',
  UNORDERED = 'unordered',
}

export enum ListItemPadding {
  XXXSMALL = 'xxxsmall',
  XXSMALL = 'xxsmall',
  XSMALL = 'xsmall',
  SMALL = 'small',
  MID = 'mid',
  NONE = 'none',
}

export enum ListItemInputAlignment {
  TOP = 'top',
  CENTER = 'middle',
}

@Component({
  selector: 'fl-list-item-header',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemHeaderComponent {}

@Component({
  selector: 'fl-list-item-body',
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemBodyComponent {}

@Component({
  selector: 'fl-list-item',
  template: `
    <fl-bit
      class="BitsListItem"
      [attr.data-type]="type"
      [attr.data-transparent]="transparent"
    >
      <ng-template #content><ng-content></ng-content></ng-template>
      <ng-container [ngSwitch]="type">
        <ng-container *ngSwitchCase="ListItemType.ORDERED">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </ng-container>
        <ng-container *ngSwitchCase="ListItemType.UNORDERED">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </ng-container>
        <ng-container *ngSwitchDefault>
          <fl-bit
            class="BitsListItemContainer"
            [ngClass]="{
              Bordered:
                type !== ListItemType.NON_BORDERED && (bottomBorder || !last),
              Selected: (selectable || selectByKeyboard) && active,
              Indent: indent,
              Card:
                ((selectable || selectByKeyboard) &&
                  radioValue === undefined) ||
                card
            }"
            [attr.data-type]="type"
          >
            <fl-bit
              class="BitsListItemHeader"
              [ngClass]="{
                HasHoverState: (isFormInput() || clickable) && control.enabled,
                OuterPadding: outerPadding,
                First: first,
                Last: last
              }"
              [attr.data-padding]="padding"
              (click)="onClick($event)"
            >
              <fl-bit
                class="Left"
                *ngIf="isFormInput()"
                [ngSwitch]="type"
                [attr.data-input-alignment]="inputAlignment"
              >
                <fl-bit class="Mask"></fl-bit>

                <fl-radio
                  class="Radio"
                  *ngSwitchCase="ListItemType.RADIO"
                  [control]="control"
                  [options]="[radioValue]"
                  [forListItem]="true"
                ></fl-radio>

                <fl-checkbox
                  class="Checkbox"
                  *ngSwitchCase="ListItemType.CHECKBOX"
                  [control]="control"
                  [forListItem]="true"
                ></fl-checkbox>

                <fl-toggle
                  class="Toggle"
                  *ngSwitchCase="ListItemType.TOGGLE"
                  [control]="control"
                  [forListItem]="true"
                ></fl-toggle>
              </fl-bit>

              <fl-bit class="BitsListItemContent" *ngIf="!body && !header">
                <ng-container *ngTemplateOutlet="content"></ng-container>
              </fl-bit>

              <fl-bit
                class="Header"
                [ngClass]="{ DefaultExpandable: !isFormInput() }"
                *ngIf="header"
              >
                <ng-content select="fl-list-item-header"></ng-content>
              </fl-bit>

              <fl-bit class="Right">
                <fl-icon
                  *ngIf="type === ListItemType.DISMISS"
                  [name]="'ui-close'"
                  [size]="IconSize.SMALL"
                  (click)="onDismiss()"
                ></fl-icon>
                <fl-icon
                  class="ExpandIcon"
                  [ngClass]="{ IsActive: active }"
                  *ngIf="!isFormInput() && expandable && body"
                  [color]="IconColor.DARK"
                  [name]="'ui-chevron-down'"
                  [size]="IconSize.SMALL"
                >
                </fl-icon>
              </fl-bit>
            </fl-bit>

            <fl-bit
              class="BitsListItemBody"
              [ngClass]="{
                BodyEdgeToEdge: bodyEdgeToEdge,
                IsHidden: !body || !(active || !expandable)
              }"
              [attr.data-padding]="padding"
            >
              <ng-content select="fl-list-item-body"></ng-content>
            </fl-bit>
          </fl-bit>
        </ng-container>
      </ng-container>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit, OnChanges, OnDestroy {
  // Imported types
  ListItemType = ListItemType;
  IconColor = IconColor;
  IconSize = IconSize;

  // Host bindings
  @HostBinding('attr.role') ariaRole = 'listitem';

  // Inputs
  /** Mandatory for Checkbox, Radio and Toggle; optional for any expandable or selectable item */
  @Input() control = new FormControl(false);
  /** If this is set, the control will be treated like a radio (set to value instead of true/false)*/
  @Input() radioValue?: any;

  // Inputs passed from `List`
  @Input() type = ListItemType.DEFAULT;

  @Input() clickable = false;
  @Input() expandable = false;

  @Input() transparent = false;
  @Input() selectable = false;
  @Input() selectByKeyboard = false;
  @Input() padding = ListItemPadding.XSMALL;
  @Input() bodyEdgeToEdge = false;
  @Input() outerPadding = true;

  @Input() first = false;
  @Input() last = false;
  @Input() bottomBorder = false;
  @Input() indent = false;

  /** Form Input (radio, checkbox, toggle) alignment */
  @Input()
  inputAlignment: ListItemInputAlignment = ListItemInputAlignment.CENTER;

  @Input() card = false;

  // Outputs
  @Output() dismiss = new EventEmitter<void>();
  @Output() headerClicked = new EventEmitter<Event>();

  @ContentChild(ListItemHeaderComponent)
  header: ListItemHeaderComponent;
  @ContentChild(ListItemBodyComponent)
  body: ListItemBodyComponent;

  private controlSubscription?: Rx.Subscription;
  private _active = false;

  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.controlSubscription = this.control.valueChanges.subscribe(_ => {
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.outerPadding && (this.isFormInput() || this.clickable)) {
      throw new Error('Lists with a hover state must have outer padding!');
    }
  }

  ngOnDestroy() {
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe();
    }
  }

  onClick(event: Event) {
    // not a clickable thing: only emit headerClicked.
    if (!this.isFormInput() && !this.clickable) {
      this.headerClicked.emit(event);
      return;
    }

    this.select();
  }

  get active() {
    // if we're given a radioValue, we treat the control like a radio
    return (
      this._active ||
      (this.radioValue !== undefined
        ? this.control.value === this.radioValue
        : this.control.value)
    );
  }

  isFormInput() {
    return [
      ListItemType.RADIO,
      ListItemType.CHECKBOX,
      ListItemType.TOGGLE,
    ].includes(this.type);
  }

  onDismiss() {
    this.dismiss.emit();
  }

  select() {
    if (this.control.enabled) {
      // if we're given a radioValue, we treat the control like a radio
      if (this.radioValue !== undefined) {
        this.control.setValue(this.radioValue);
      } else {
        this.control.setValue(!this.control.value);
      }
      this.control.markAsDirty();
    }
  }

  highlight() {
    this._active = true;
  }

  deactivate() {
    this._active = false;
  }
}
