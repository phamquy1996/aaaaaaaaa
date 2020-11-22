import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ButtonColor, ButtonSize } from '@freelancer/ui/button';
import { trackByValue } from '@freelancer/ui/helpers';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { TextAlign, TextSize } from '@freelancer/ui/text';

export interface PaginationLabelOptions {
  pageSize: number; // Number of items to display per page
  total: number; // Total number of items being paginated
}

interface PaginationLabel {
  start: number; // First item currently in view
  end: number; // Last item currently in view
  total: number; // Total number of items being paginated
}

@Component({
  selector: 'fl-pagination',
  template: `
    <ng-container *ngIf="pages > 1">
      <fl-text
        *ngIf="compact && label"
        [size]="TextSize.XXSMALL"
        [textAlign]="TextAlign.CENTER"
        [flMarginBottom]="Margin.XSMALL"
      >
        <ng-container
          *ngIf="label.start !== label.end"
          i18n="
             Pagination label consisting of range of item numbers displayed and
            total number of items
          "
        >
          {{ label.start }}-{{ label.end }} of {{ label.total }}
        </ng-container>
        <ng-container
          *ngIf="label.start === label.end"
          i18n="
             Pagination label consisting of item number displayed and total
            number of items
          "
        >
          {{ label.start }} of {{ label.total }}
        </ng-container>
      </fl-text>

      <fl-bit class="ButtonGroup">
        <!-- first -->
        <fl-bit
          class="PaginationItem"
          *ngIf="extremeties && shouldShowAdditionalControls && !compact"
        >
          <fl-button
            class="PaginationButton"
            [ngClass]="{ Disabled: currentPage === 1 }"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.MINI"
            [disabled]="currentPage === 1"
            (click)="goToPage(1)"
          >
            <fl-icon
              [name]="'ui-first-page'"
              [size]="IconSize.SMALL"
              [color]="IconColor.DARK"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <!-- Previous -->
        <fl-bit
          class="PaginationItem"
          *ngIf="shouldShowAdditionalControls || compact"
        >
          <fl-button
            class="PaginationButton"
            [ngClass]="{ Disabled: currentPage === 1 }"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.MINI"
            [disabled]="currentPage === 1"
            [attr.data-compact]="compact"
            (click)="goToPage(currentPage - 1)"
          >
            <fl-icon
              [name]="'ui-chevron-left'"
              [size]="IconSize.SMALL"
              [color]="IconColor.DARK"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <!-- Numbered -->
        <fl-bit class="NumeralContainer" *ngIf="!compact">
          <fl-bit
            class="PaginationItem"
            *ngFor="let numeral of numerals; trackBy: trackByValue"
          >
            <fl-button
              class="PaginationButton"
              [color]="
                numeral === currentPage
                  ? ButtonColor.SECONDARY
                  : ButtonColor.DEFAULT
              "
              [size]="ButtonSize.MINI"
              [display]="'flex'"
              (click)="goToPage(numeral)"
            >
              <fl-bit
                [ngClass]="{ NumeralNotSelected: numeral !== currentPage }"
              >
                {{ numeral }}
              </fl-bit>
            </fl-button>
          </fl-bit>
        </fl-bit>

        <!-- Next -->
        <fl-bit
          class="PaginationItem"
          *ngIf="shouldShowAdditionalControls || compact"
        >
          <fl-button
            class="PaginationButton"
            [ngClass]="{ Disabled: currentPage === pages }"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.MINI"
            [disabled]="currentPage === pages"
            [attr.data-compact]="compact"
            (click)="goToPage(currentPage + 1)"
          >
            <fl-icon
              [name]="'ui-chevron-right'"
              [size]="IconSize.SMALL"
              [color]="IconColor.DARK"
            ></fl-icon>
          </fl-button>
        </fl-bit>

        <!-- Last -->
        <fl-bit
          class="PaginationItem"
          *ngIf="extremeties && shouldShowAdditionalControls && !compact"
        >
          <fl-button
            class="PaginationButton"
            [ngClass]="{ Disabled: currentPage === pages }"
            [color]="ButtonColor.DEFAULT"
            [size]="ButtonSize.MINI"
            [disabled]="currentPage === pages"
            (click)="goToPage(pages)"
          >
            <fl-icon
              [name]="'ui-last-page'"
              [size]="IconSize.SMALL"
              [color]="IconColor.DARK"
            ></fl-icon>
          </fl-button>
        </fl-bit>
      </fl-bit>
    </ng-container>
  `,
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  ButtonColor = ButtonColor;
  ButtonSize = ButtonSize;
  TextSize = TextSize;
  IconSize = IconSize;
  IconColor = IconColor;
  Margin = Margin;
  TextAlign = TextAlign;
  trackByValue = trackByValue;

  numerals: ReadonlyArray<number> = [];

  /** Only used on compact view */
  label?: PaginationLabel;

  /** Displays first, previous, next, last controls */
  shouldShowAdditionalControls = false;

  /** Displays page numbers within a select input */
  @HostBinding('attr.data-compact')
  @Input()
  compact = false;

  /** Current page selected */
  @Input() currentPage: number;

  /** Displays first and last controls */
  @Input() extremeties = true;

  /** Information needed to generate labels */
  @Input() labelOptions?: PaginationLabelOptions;

  /** Total number of pages */
  @Input() pages: number;

  @Output() pageSelected = new EventEmitter<number>();

  ngOnChanges() {
    this.shouldShowAdditionalControls = this.pages > 5;
    this.numerals = this.getNumerals();
    this.label = this.getLabel(this.currentPage, this.labelOptions);
  }

  /**
   * Pushes a value up to conform to a minimum or down to conform to a maximum
   */
  getBoundValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Returns the pagination labels
   */
  getLabel(
    currentPage: number,
    labelOptions?: PaginationLabelOptions,
  ): PaginationLabel | undefined {
    if (currentPage && labelOptions) {
      const { start, end } = this.getPageRange(currentPage, labelOptions);

      return {
        total: labelOptions.total,
        start,
        end,
      };
    }
  }

  /**
   * Returns up to five (5) page numbers relative to the current page
   */
  getNumerals(): ReadonlyArray<number> {
    const lowerBound = this.getBoundValue(
      this.currentPage - 2,
      1,
      Math.max(this.pages - 4, 1),
    );
    const upperBound = this.getBoundValue(this.currentPage + 2, 5, this.pages);

    return this.getSequenceArray(lowerBound, upperBound);
  }

  /**
   * Returns the indices of start and end items currently displayed
   * relative to current page and page size
   */
  getPageRange(
    currentPage: number,
    labelOptions: PaginationLabelOptions,
  ): { [key: string]: number } {
    const start =
      currentPage * labelOptions.pageSize - labelOptions.pageSize + 1;

    // Don't go over total number of items
    const end = Math.min(
      currentPage * labelOptions.pageSize,
      labelOptions.total,
    );

    return {
      start,
      end,
    };
  }

  /**
   * Returns an array containing numbers between start and end (inclusive)
   */
  getSequenceArray(start: number, end: number): ReadonlyArray<number> {
    return Array.from(Array(end + 1).keys()).filter(n => n >= start);
  }

  goToPage(page: number): void {
    const validPageNumber = page === this.getBoundValue(page, 1, this.pages);

    if (!validPageNumber) {
      return;
    }

    this.pageSelected.emit(page);
    this.currentPage = page;
    this.numerals = this.getNumerals();
    this.label = this.getLabel(page, this.labelOptions);
  }
}
