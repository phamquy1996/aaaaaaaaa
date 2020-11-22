import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { CalloutPlacement, CalloutSize } from '@freelancer/ui/callout';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { LinkColor } from '@freelancer/ui/link';
import { ListItemPadding, ListItemType } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontWeight, TextAlign } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';

/** Corresponds to the fl-col widths in fl-grid */
export type TableColumnGridWidth =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

export enum TableColumnVerticalAlign {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export enum TableColumnPaddingSize {
  SMALL = 'small',
  MID = 'mid',
}

export enum TablePaginationPosition {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
}

export enum TableExpandableBackgroundColor {
  LIGHT = 'light',
}

export enum ResponsiveColumnPlacement {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM_LEFT = 'bottom_left',
  BOTTOM_RIGHT = 'bottom_right',
  BOTTOM_ACTION = 'bottom_action',
  HIDE_COLUMN = 'hide_column',
  SHOW_EXPANDABLE = 'show_expandable',
}

export interface TableRow<T> {
  item: T;
  highlight?: boolean;
}

@Component({
  selector: 'fl-table-expandable-content',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableExpandableContentComponent {
  @Input() backgroundColor?: TableExpandableBackgroundColor;
  @Input() edgeToEdge = false;

  @ContentChild('content') contentTemplate: TemplateRef<any>;
}

@Component({
  selector: 'fl-table-col',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnComponent implements OnChanges {
  TextAlign = TextAlign;

  /** String title for the column. Must be unique in table. */
  @Input() title: string;
  @Input() columnName: string;
  @Input() textAlign = TextAlign.LEFT;
  @Input() verticalAlign = TableColumnVerticalAlign.MIDDLE;
  @Input() columnPlacement: ResponsiveColumnPlacement =
    ResponsiveColumnPlacement.HIDE_COLUMN;
  @Input() gridWidth: TableColumnGridWidth | undefined = undefined;
  @Input() sortable = false;
  @Input() tooltipIconName: string;
  @Input() calloutSize = CalloutSize.MEDIUM;
  @Input() flHide = false;
  @Input() flHideMobile = false;
  @Input() flHideTablet = false;
  @Input() flHideDesktop = false;
  @Output() sortClicked = new EventEmitter<void>();

  @ContentChild('cell') cellTemplate: TemplateRef<TableColumnComponent>;
  @ContentChild('calloutContent')
  calloutContent: TemplateRef<TableColumnComponent>;

  ngOnChanges() {
    if (this.title && !this.columnName) {
      this.columnName = this.title;
    }
  }
}

@Component({
  selector: 'fl-table',
  template: `
    <table class="Table" [attr.data-fixed-layout]="fixedLayout">
      <ng-container *ngIf="!hideHeader">
        <thead class="HeaderGroup" [flHideMobile]="responsive">
          <tr
            class="Row HeaderRow"
            [attr.data-border]="border"
            [attr.data-expandable-body-compact]="expandableBodyCompact"
          >
            <th
              class="Cell HeaderCell"
              *ngFor="let column of columns$ | async"
              [attr.data-edge-to-edge]="edgeToEdge"
              [attr.data-text-align]="column.textAlign"
              [attr.data-nowrap]="column.sortable"
              [attr.data-padding-size]="paddingSize"
              [attr.data-grid-width]="column.gridWidth"
              [flHide]="column.flHide"
              [flHideMobile]="column.flHideMobile"
              [flHideTablet]="column.flHideTablet"
              [flHideDesktop]="column.flHideDesktop"
            >
              <fl-text [color]="FontColor.MID" [weight]="FontWeight.BOLD">
                <ng-container *ngIf="!column.sortable">
                  {{ column.title }}
                </ng-container>
                <fl-link
                  *ngIf="column.sortable"
                  [color]="LinkColor.INHERIT"
                  (click)="column.sortClicked.emit()"
                >
                  {{ column.title }}
                  <fl-icon
                    [name]="'ui-sort'"
                    [size]="IconSize.SMALL"
                    [color]="IconColor.INHERIT"
                  ></fl-icon>
                </fl-link>
                <ng-container *ngIf="column.tooltipIconName">
                  <fl-callout
                    [edgeToEdge]="true"
                    [hover]="true"
                    [placement]="CalloutPlacement.BOTTOM"
                    [size]="column.calloutSize"
                  >
                    <fl-callout-trigger>
                      <fl-icon
                        [name]="column.tooltipIconName"
                        [size]="IconSize.SMALL"
                      ></fl-icon>
                    </fl-callout-trigger>

                    <fl-callout-content>
                      <ng-container
                        [ngTemplateOutlet]="column.calloutContent"
                      ></ng-container
                    ></fl-callout-content>
                  </fl-callout>
                </ng-container>
              </fl-text>
            </th>
            <!-- Custom expandables are declared in the parent, so omit this header row -->
            <th
              [ngClass]="{ HeaderColumnExpandable: expandableBodyCompact }"
              *ngIf="expandable && !customExpandable"
            ></th>
          </tr>
        </thead>
      </ng-container>
      <tbody class="BodyGroup">
        <ng-container
          *ngFor="
            let row of tableRows
              | slice
                : (currentPage - 1) * itemsPerPage
                : currentPage * itemsPerPage;
            trackBy: rowTrackBy;
            index as i
          "
        >
          <tr
            class="Row BodyRow"
            [attr.data-edge-to-edge]="edgeToEdge"
            [attr.data-border]="border"
            [attr.data-hover]="hover"
            [attr.data-highlight]="row.highlight"
            [attr.data-expandable]="expandable"
            [attr.data-mobile-view-compact]="mobileViewCompact"
            [attr.data-expandable-body-compact]="expandableBodyCompact"
            [attr.data-row]="i"
          >
            <td
              class="Cell BodyCell"
              *ngFor="let column of columns$ | async"
              [attr.data-edge-to-edge]="edgeToEdge"
              [attr.data-vertical-align]="column.verticalAlign"
              [attr.data-padding-size]="paddingSize"
              [attr.data-text-align]="column.textAlign"
              [attr.data-grid-width]="column.gridWidth"
              [attr.data-column-placement]="column.columnPlacement"
              [flMarginBottom]="Margin.XXSMALL"
              [flHide]="column.flHide"
              [flHideMobile]="column.flHideMobile"
              [flHideTablet]="column.flHideTablet"
              [flHideDesktop]="column.flHideDesktop"
            >
              <!--
                we hide this text with ngIf instead of adding it with CSS :before content
                this lets us use the fl-text styling here
              -->
              <fl-bit *ngIf="!mobileViewCompact" class="ContentWrapper">
                <fl-text
                  class="MobileHeader"
                  *ngIf="responsive"
                  [flShowMobile]="true"
                  [flMarginRight]="Margin.XXSMALL"
                  [color]="FontColor.DARK"
                  [weight]="FontWeight.BOLD"
                >
                  {{ column.title }}
                  <ng-container *ngIf="column.tooltipIconName">
                    <fl-callout
                      [edgeToEdge]="true"
                      [hover]="true"
                      [placement]="CalloutPlacement.BOTTOM"
                      [size]="column.calloutSize"
                    >
                      <fl-callout-trigger>
                        <fl-icon
                          [name]="column.tooltipIconName"
                          [size]="IconSize.SMALL"
                        ></fl-icon>
                      </fl-callout-trigger>

                      <fl-callout-content>
                        <ng-container
                          [ngTemplateOutlet]="column.calloutContent"
                        ></ng-container
                      ></fl-callout-content>
                    </fl-callout>
                  </ng-container>
                </fl-text>
                <fl-text class="CellText">
                  <ng-container
                    [ngTemplateOutlet]="column.cellTemplate"
                    [ngTemplateOutletContext]="{
                      $implicit: row.item,
                      index: i
                    }"
                  ></ng-container>
                </fl-text>
              </fl-bit>
              <fl-bit *ngIf="mobileViewCompact" class="ContentWrapper">
                <fl-bit class="CellText">
                  <ng-container
                    [ngTemplateOutlet]="column.cellTemplate"
                    [ngTemplateOutletContext]="{
                      $implicit: row.item,
                      index: i
                    }"
                  ></ng-container>
                </fl-bit>
              </fl-bit>
            </td>
            <td
              class="Cell BodyCell CellIcon"
              [attr.data-edge-to-edge]="edgeToEdge"
              [attr.data-padding-size]="paddingSize"
              *ngIf="expandable && !customExpandable"
            >
              <fl-icon
                class="ExpandIcon"
                [name]="'ui-chevron-down'"
                [color]="IconColor.DARK"
                [size]="IconSize.SMALL"
                (click)="toggleExpandedContent(i)"
              ></fl-icon>
            </td>
          </tr>

          <tr
            class="Row BodyRow IsHidden BodyRowExpandable"
            *ngIf="expandable && expandableContent"
            [attr.data-edge-to-edge]="
              expandableContent.edgeToEdge || edgeToEdge
            "
            [attr.data-border]="border"
            [attr.data-hover]="hover"
            [attr.data-highlight]="row.highlight"
            [attr.data-expandable]="expandable"
            [attr.data-expandable-body-compact]="expandableBodyCompact"
            [attr.data-background-color]="expandableContent.backgroundColor"
            [attr.data-expandable-row]="i"
          >
            <td
              *ngIf="!expandableBodyCompact"
              [colSpan]="
                customExpandable
                  ? (columns$ | async)?.length
                  : (columns$ | async)?.length + 1
              "
            >
              <ng-container
                [ngTemplateOutlet]="expandableContent.contentTemplate"
                [ngTemplateOutletContext]="{ $implicit: row.item, index: i }"
              ></ng-container>
            </td>

            <td
              *ngIf="mobileViewCompact && expandableBodyCompact"
              class="Cell BodyCell"
              [flHideTablet]="true"
              [flHideDesktop]="true"
            >
              <fl-bit
                class="BodyCellExpandable"
                *ngFor="let column of columns$ | async"
                [attr.data-column-placement]="column.columnPlacement"
                [flMarginBottom]="Margin.XXSMALL"
              >
                <fl-bit class="ContentWrapper">
                  <fl-text
                    class="MobileHeader"
                    [flShowMobile]="true"
                    [flMarginRight]="Margin.XXSMALL"
                    [color]="FontColor.DARK"
                    [weight]="FontWeight.BOLD"
                  >
                    {{ column.title }}
                  </fl-text>
                  <fl-text class="CellText">
                    <ng-container
                      [ngTemplateOutlet]="column.cellTemplate"
                      [ngTemplateOutletContext]="{
                        $implicit: row.item,
                        index: i
                      }"
                    ></ng-container>
                  </fl-text>
                </fl-bit>
              </fl-bit>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
    <fl-pagination
      class="TablePagination"
      *ngIf="dataSource.length > itemsPerPage && totalPages"
      [attr.data-pagination-position]="paginationPosition"
      [attr.data-border]="border"
      [compact]="compactPagination"
      [currentPage]="currentPage"
      [pages]="totalPages"
      (pageSelected)="onPageSelected($event)"
    ></fl-pagination>
  `,
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements AfterContentInit, OnChanges {
  CalloutPlacement = CalloutPlacement;
  FontColor = FontColor;
  FontWeight = FontWeight;
  IconSize = IconSize;
  IconColor = IconColor;
  LinkColor = LinkColor;
  ListItemPadding = ListItemPadding;
  ListItemType = ListItemType;
  TextAlign = TextAlign;
  Margin = Margin;

  @Input() dataSource: ReadonlyArray<T>;
  @Input() rowTrackBy?: TrackByFunction<TableRow<T>>;
  @Input() border = true;
  @Input() hover = false;
  @Input() edgeToEdge = false;
  @Input() hideHeader = false;
  @Input() expandable = false;
  @Input() expandableBodyCompact = false;

  /** Allow programmatically expanding the table without showing the chevron icon */
  @Input() customExpandable = false;
  /** Only allow expanding one row at a time */
  @Input() singleExpandable = false;
  /** Use with any width input on fl-table-col to fix table layout */
  @Input() fixedLayout = false;

  /** Set pagination component to use compact mode */
  @Input() compactPagination = false;
  @Input() itemsPerPage: number = Number.POSITIVE_INFINITY;
  /** Position applys only for tablet viewport and up */
  @Input() paginationPosition = TablePaginationPosition.CENTER;
  @Input() initialPage = 1;

  @Input() paddingSize = TableColumnPaddingSize.MID;

  @HostBinding('attr.data-responsive')
  @Input()
  responsive? = true;

  @HostBinding('attr.data-mobile-view-compact')
  @Input()
  mobileViewCompact? = false;

  @Output() pageSelected = new EventEmitter<number>();
  /** Emits the index of the currently expanded row - undefined if no row is expanded */
  @Output() rowExpanded = new EventEmitter<number | undefined>();

  @ContentChild(TableExpandableContentComponent)
  expandableContent: TableExpandableContentComponent;

  @ContentChildren(TableColumnComponent)
  childColumns: QueryList<TableColumnComponent>;

  columns$: Rx.Observable<TableColumnComponent[]>;
  tableRows: ReadonlyArray<TableRow<T>>;

  // if we should use the grid display instead of flat rows
  showTableGrid$: Rx.Observable<boolean>;
  currentPage = 1;
  totalPages = 5;

  // indices of rows that are currently expanded
  private currentlyExpandedRows: readonly number[] = [];

  constructor(private elementRef: ElementRef) {}

  ngAfterContentInit() {
    this.columns$ = this.childColumns.changes.pipe(
      startWith(this.childColumns.toArray()),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSource) {
      this.tableRows = this.dataSource.map(sourceItem => ({
        item: sourceItem,
        highlight: (sourceItem as any).highlight,
      }));
      this.totalPages = Math.ceil(this.dataSource.length / this.itemsPerPage);
    }
    if (this.initialPage && 'initialPage' in changes) {
      this.currentPage = this.initialPage;
    }
  }

  /** For use with custom expandable tables */
  toggleExpandedContent(rowIndex: number) {
    if (
      this.singleExpandable &&
      this.currentlyExpandedRows.length > 0 &&
      !this.currentlyExpandedRows.includes(rowIndex)
    ) {
      this.toggleRow(this.currentlyExpandedRows[0]); // close old row
    }

    this.toggleRow(rowIndex);
  }

  private toggleRow(rowIndex: number) {
    const { nativeElement } = this.elementRef;

    const row: HTMLElement = nativeElement.querySelector(
      `[data-row="${rowIndex}"]`,
    ) as HTMLElement;

    const expandableRow: HTMLElement = nativeElement.querySelector(
      `[data-expandable-row="${rowIndex}"]`,
    ) as HTMLElement;

    if (row && expandableRow) {
      row.classList.toggle('IsActive');
      expandableRow.classList.toggle('IsHidden');
      expandableRow.classList.toggle('IsActive');
    }

    // if a currently expanded row is toggled, remove it from the buffer
    if (this.currentlyExpandedRows.includes(rowIndex)) {
      this.currentlyExpandedRows = this.currentlyExpandedRows.filter(
        i => rowIndex !== i,
      );
    } else {
      this.currentlyExpandedRows = [...this.currentlyExpandedRows, rowIndex];
    }

    if (this.currentlyExpandedRows.length === 0) {
      this.rowExpanded.emit(undefined);
    } else {
      this.rowExpanded.emit(rowIndex);
    }
  }

  onPageSelected(page: number) {
    this.currentPage = page;
    this.pageSelected.emit(this.currentPage);

    // Reset expanded rows
    if (this.expandable) {
      this.currentlyExpandedRows = [];
      this.rowExpanded.emit(undefined);
    }
  }
}
