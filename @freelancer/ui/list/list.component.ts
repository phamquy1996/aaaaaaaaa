import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  ListItemComponent,
  ListItemInputAlignment,
  ListItemPadding,
  ListItemType,
} from '../list-item/list-item.component';

@Component({
  selector: 'fl-list',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements AfterContentInit, OnChanges, OnDestroy {
  ListItemType = ListItemType;

  /** Removes padding from the fl-list-item-body subcomponent */
  @Input() bodyEdgeToEdge = false;
  /** Adds an extra border to the bottom of the list */
  @Input() bottomBorder = false;
  @Input() clickable = false;
  @Input() expandable = false;
  /** Applies a blue border when the item is active */
  @Input() selectable = false;
  @Input() transparent = false;
  /** Applies left and right padding to the list items */
  @Input() outerPadding = true;
  @Input() indent = false;
  @Input() padding = ListItemPadding.XSMALL;
  @Input() inputAlignment = ListItemInputAlignment.CENTER;
  @Input() selectByKeyboard = false;

  @HostBinding('attr.data-type')
  @Input()
  type = ListItemType.DEFAULT;

  @HostBinding('attr.role') readonly ariaRole = 'list';

  // Child components
  @ContentChildren(ListItemComponent)
  listItemComponents: QueryList<ListItemComponent>;

  private childListSubscription?: Rx.Subscription;
  private activeListItem?: ListItemComponent;
  private activeListItemIndex?: number;

  ngOnChanges() {
    // apply properties to child list-items whenever the properties change.
    this.applyPropertiesToChildren();
  }

  ngAfterContentInit() {
    // apply properties to child list-items whenever the list of children changes
    this.childListSubscription = this.listItemComponents.changes
      .pipe(startWith(this.listItemComponents.toArray()))
      .subscribe(() => this.applyPropertiesToChildren());
  }

  ngOnDestroy() {
    if (this.childListSubscription) {
      this.childListSubscription.unsubscribe();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key?.toLowerCase();
    if (this.selectByKeyboard && ['arrowup', 'up'].includes(key)) {
      // up arrow
      if (!this.activeListItem) {
        this.activeListItemIndex = this.listItemComponents.length - 1;
      } else if (
        isDefined(this.activeListItemIndex) &&
        this.activeListItemIndex >= 0
      ) {
        this.activeListItemIndex--;
      }
    } else if (
      this.selectByKeyboard &&
      ['arrowdown', 'down', 'tab'].includes(key)
    ) {
      // down arrow OR tab
      if (!this.activeListItem) {
        this.activeListItemIndex = 0;
      } else if (
        isDefined(this.activeListItemIndex) &&
        this.activeListItemIndex < this.listItemComponents.length
      ) {
        this.activeListItemIndex++;
      }
    }

    // Activate the current list item by activeListItemIndex
    // and deactivate the previous one if that's defined
    if (this.selectByKeyboard && isDefined(this.activeListItemIndex)) {
      this.activeListItem?.deactivate();
      this.activeListItem?.changeDetectorRef.detectChanges();
      this.activeListItem = this.listItemComponents.find(
        (component, index) => index === this.activeListItemIndex,
      );
      if (key === 'enter') {
        // Select list item after ENTER pressed
        this.activeListItem?.select();
      } else {
        this.activeListItem?.highlight();
        this.activeListItem?.changeDetectorRef.detectChanges();
      }
    }
  }

  /**
   * Applies all the input properties of this list to its child list items
   * Only affects direct children of list, to allow nesting.
   */
  applyPropertiesToChildren() {
    if (this.listItemComponents) {
      this.listItemComponents.forEach((component, index, arr) => {
        // detach to avoid "changed after it was checked" shenanigans"
        component.changeDetectorRef.detach();
        component.bodyEdgeToEdge = this.bodyEdgeToEdge;
        component.bottomBorder = this.bottomBorder;
        component.clickable = this.clickable;
        component.expandable = this.expandable;
        component.indent = this.indent;
        component.inputAlignment = this.inputAlignment;
        component.padding = this.padding;
        component.selectable = this.selectable;
        component.selectByKeyboard = this.selectByKeyboard;
        component.transparent = this.transparent;
        component.outerPadding = this.outerPadding;
        component.type = this.type;
        component.first = index === 0;
        component.last = index === arr.length - 1;

        // reattach and detect changes;
        component.changeDetectorRef.reattach();
        component.changeDetectorRef.detectChanges();
      });
    }
  }
}
