import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputComponent } from '@freelancer/ui/input';
import { ListItemComponent } from '@freelancer/ui/list-item';
import { Focus } from '../focus/focus.service';

export interface SearchItem {
  type: string;
  context?: any;
  displayValue?: string;
}

export interface GroupedSearchResults {
  [key: string]: SearchItem[];
}

@Component({
  selector: 'fl-search',
  template: `
    <fl-input
      [control]="queryControl"
      [placeholder]="placeholder"
      [iconStart]="'ui-search'"
      [rightIconColor]="IconColor.MID"
      [isExpandable]="isExpandable"
      [expanded]="expanded"
      [searchInput]="true"
      (iconStartClick)="handleIconStartClick($event)"
      (keyup)="handleInputKeyUp($event)"
      (keydown)="handleInputKeyDown($event)"
      #inputComponent
    ></fl-input>
    <fl-button
      class="ButtonClear"
      *ngIf="queryControl.value"
      (click)="handleIconClearClick($event)"
    >
      <fl-icon
        class="IconClear"
        [name]="'ui-close-alt'"
        [color]="IconColor.MID"
        [size]="IconSize.SMALL"
      ></fl-icon>
    </fl-button>

    <fl-card
      class="SearchResults"
      *ngIf="displayResults && queryControl.value"
      [edgeToEdge]="true"
    >
      <perfect-scrollbar
        *ngIf="scrollableSearchResults; else nonScrollable"
        class="ScrollbarContainer"
      >
        <ng-container *ngTemplateOutlet="searchResults"></ng-container>
      </perfect-scrollbar>
      <ng-template #nonScrollable>
        <ng-container *ngTemplateOutlet="searchResults"></ng-container>
      </ng-template>
    </fl-card>

    <ng-template #searchResults>
      <ng-container *ngFor="let type of itemTypes">
        <fl-list>
          <fl-list-item *ngIf="itemTypeTitles[type]">
            <fl-bit class="GroupTitle"> {{ getTypeTitle(type) }} </fl-bit>
          </fl-list-item>
        </fl-list>
        <fl-list [bottomBorder]="true" [clickable]="true">
          <fl-list-item
            #listItem
            *ngFor="let item of groupedSearchResults[type]; let i = index"
            (mousemove)="mouseMove(listItem)"
            (mouseleave)="mouseLeave()"
            (click)="selectItem(item)"
            [attr.itemType]="type"
            [attr.itemIndex]="i"
          >
            <ng-container
              *ngTemplateOutlet="
                itemTemplates[item.type];
                context: { $implicit: item.context }
              "
            ></ng-container>
          </fl-list-item>
        </fl-list>
      </ng-container>
    </ng-template>
  `,
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnChanges, OnInit {
  IconSize = IconSize;
  IconColor = IconColor;
  expanded = false;
  groupedSearchResults: GroupedSearchResults = {};
  queryControl = new FormControl('');
  focusIndex = -1;
  focusItem: ListItemComponent;
  inputFocus = false;
  itemTypes: (keyof GroupedSearchResults)[] = [];

  @Input() isExpandable = false;
  @Input() iconEnd?: string;
  @Input() itemTypeTitles: { [type: string]: string } = {};
  @Input() itemTemplates: { [type: string]: TemplateRef<any> } = {};
  /** Limits search results' container height to 200px and makes it scrollable. */
  @Input() scrollableSearchResults = false;
  @Input() searchResults: SearchItem[] = [];
  @Input() placeholder = 'Search';
  @Input() displayResults = true;

  @Output() query = new EventEmitter<string>();
  @Output() select = new EventEmitter<SearchItem>();
  @Output() submit = new EventEmitter<void>();
  @Output() clear = new EventEmitter<void>();

  // Reference to input component
  @ViewChild('inputComponent')
  inputComponent: InputComponent;
  // Reference to list of components
  @ViewChildren('listItem') listItems: QueryList<ListItemComponent>;
  // Reference to list of ElementRef<HTMLElement>s
  @ViewChildren('listItem', { read: ElementRef })
  listItemElements: QueryList<ElementRef<HTMLElement>>;

  constructor(private focus: Focus) {}

  // Listening for clicks outside the input component
  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    if (
      event &&
      !this.inputComponent.inputContainer.nativeElement.contains(
        event.target as HTMLElement,
      ) &&
      this.expanded
    ) {
      // expanded while there is a query
      this.expanded = !!this.queryControl.value;
      this.displayResults = false;
    }
  }

  ngOnInit() {
    this.queryControl.valueChanges.subscribe(query => {
      this.query.emit(query);
    });
  }

  ngOnChanges() {
    this.removeFocus();
    const baseGroupedSearchResults: GroupedSearchResults = { untyped: [] };
    this.groupedSearchResults = this.searchResults.reduce((acc, i) => {
      if (!(i.type in acc)) {
        acc[i.type] = [];
      }
      acc[i.type].push(i);
      return acc;
    }, baseGroupedSearchResults);

    this.itemTypes = Object.keys(this.groupedSearchResults);
  }

  handleIconStartClick(e: MouseEvent) {
    e.stopPropagation();
    this.focus.focusElement(this.inputComponent.nativeElement);
    this.displayResults = true;
    this.expanded = true;
  }

  handleIconClearClick(e: MouseEvent) {
    e.stopPropagation();
    this.clearQuery();
    this.focus.focusElement(this.inputComponent.nativeElement);
  }

  clearQuery() {
    this.queryControl.setValue('');
    this.clear.emit();
  }

  handleInputKeyDown(e: KeyboardEvent) {
    const k = e.key.toLowerCase();
    if (k === 'arrowdown') {
      // Prevent cursor from moving to the right
      e.preventDefault();
    } else if (k === 'arrowup') {
      // Prevent cursor from moving to the left
      e.preventDefault();
    } else if (k === 'tab') {
      // Prevent default tab action
      e.preventDefault();
    }
  }

  handleInputKeyUp(e: KeyboardEvent) {
    const k = e.key.toLowerCase();
    if (k === 'enter') {
      this.selectOrSubmit();
      return;
    }
    if (k === 'escape') {
      // IMPORTANT - if you modify this behaviour make sure
      // to update multi-select. They should offer the same functionality.
      this.clearQuery();
    } else if (k === 'arrowdown') {
      this.moveDown();
      e.stopPropagation();
      e.preventDefault();
    } else if (k === 'arrowup') {
      this.moveUp();
      e.stopPropagation();
      e.preventDefault();
    } else if (k === 'tab') {
      if (e.shiftKey) {
        this.moveUp();
      } else {
        this.moveDown();
      }
      e.stopPropagation();
      e.preventDefault();
    }
  }

  selectOrSubmit() {
    if (this.focusItem) {
      const itemType = this.listItemElements
        .toArray()
        [this.focusIndex].nativeElement.getAttribute('itemType') as string;
      const itemIndex = Number(
        this.listItemElements
          .toArray()
          [this.focusIndex].nativeElement.getAttribute('itemIndex') as string,
      );
      this.select.emit(this.groupedSearchResults[itemType][itemIndex]);
    } else {
      this.submit.emit();
    }
  }

  selectItem(item: SearchItem) {
    this.select.emit(item);
    if (item.displayValue) {
      this.queryControl.setValue(item.displayValue, {
        emitEvent: false,
      });
    } else {
      this.clearQuery();
    }
  }

  // Focus helpers - there's quite a few of these, sorry.
  moveDown() {
    this.focusIndex += 1;
    this.reFocus();
  }

  moveUp() {
    this.focusIndex -= 1;
    this.reFocus();
  }

  mouseMove(item: ListItemComponent) {
    this.focusIndex = this.listItems.toArray().indexOf(item);
    this.reFocus();
  }

  mouseLeave() {
    this.removeFocus();
  }

  reFocus() {
    this.fixFocusOverflow();
    this.updateFocusItem();
  }

  updateFocusItem() {
    const focusItem = this.listItems.toArray()[this.focusIndex];
    if (focusItem) {
      this.focusItem = focusItem;
    }
  }

  removeFocus() {
    if (this.focusItem) {
      delete this.focusItem;
      this.focusIndex = -1;
    }
  }

  fixFocusOverflow() {
    if (this.focusIndex < 0) {
      this.focusIndex = this.searchResults.length - 1;
    } else if (this.focusIndex >= this.searchResults.length) {
      this.focusIndex = 0;
    }
  }

  getTypeTitle(type: string) {
    return type in this.itemTypeTitles && this.itemTypeTitles[type]
      ? this.itemTypeTitles[type]
      : '';
  }
}
