import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

export enum BudgetLength {
  SHORT = 'short',
  LONG = 'long',
}

@Component({
  selector: 'fl-budget',
  template: `
    <ng-container *ngIf="budgetExists(_min) && budgetExists(_max)">
      {{ min | currency: currencyCode:'symbol-narrow':'1.0-0' }} -
      {{ max | number: '1.0-0' }}
    </ng-container>
    <ng-container *ngIf="budgetExists(_min) && !budgetExists(_max)">
      > {{ min | currency: currencyCode:'symbol-narrow':'1.0-0' }}
    </ng-container>
    <ng-container *ngIf="!budgetExists(_min) && budgetExists(_max)">
      < {{ max | currency: currencyCode:'symbol-narrow':'1.0-0' }}
    </ng-container>
    <ng-container *ngIf="length === 'long'">{{ currencyCode }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetComponent implements AfterViewInit {
  _min?: number;
  _max?: number;

  /** The currency code of the budget */
  @Input() currencyCode: string;
  /** The length of the component text output. */
  @Input() length: BudgetLength = BudgetLength.LONG;
  /** The minimum budget. Can be optional as long as maximum budget is defined. */
  @Input()
  get min() {
    return this._min;
  }
  set min(value: number | string | undefined) {
    this._min = value ? Number(value) : undefined;
  }
  /** The maximum budget. Can be optional as long as minimum budget is defined. */
  @Input()
  get max() {
    return this._max;
  }
  set max(value: number | string | undefined) {
    this._max = value ? Number(value) : undefined;
  }

  budgetExists(budget?: number) {
    return !!budget;
  }

  ngAfterViewInit() {
    // Throw an error if min or max is undefined
    if (!this._min && !this._max) {
      throw new Error('Specify a min and/or a max for fl-budget.');
    }

    if (this._min !== undefined && Number.isNaN(this._min)) {
      throw new Error(`The min value converts to NaN, which it shouldn't be.`);
    }

    if (this._max !== undefined && Number.isNaN(this._max)) {
      throw new Error(`The max value converts to NaN, which it shouldn't be.`);
    }

    if (!this.currencyCode) {
      throw new Error('Missing currency code on fl-budget.');
    }
  }
}
