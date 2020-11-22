import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

export enum CurrencyLength {
  SHORT = 'short',
  LONG = 'long',
  DECIMAL = 'decimal',
}

@Component({
  selector: 'fl-currency',
  template: `
    <ng-container *ngIf="length === 'long'"
      >{{ value | currency: code:'symbol-narrow':'1.2-2' }}
      {{ code }}</ng-container
    >
    <ng-container *ngIf="length === 'short'">{{
      value | currency: code:'symbol-narrow':'1.2-2'
    }}</ng-container>
    <ng-container *ngIf="length === 'decimal'">{{
      value | number: '1.2-2'
    }}</ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyComponent {
  @HostBinding('attr.code')
  @Input()
  code: string;
  @HostBinding('attr.value')
  @Input()
  value: number;
  @HostBinding('attr.length')
  @Input()
  length: CurrencyLength = CurrencyLength.LONG;
}
