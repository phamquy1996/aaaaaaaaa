import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';

export enum RadioSize {
  SMALL = 'small',
  LARGE = 'large',
}

export enum RadioAlignment {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface RadioOptionItem {
  value: string;
  displayText: string;
}

@Component({
  selector: 'fl-radio',
  template: `
    <fl-bit
      class="RadioContainer"
      [ngClass]="{
        IsInvalid: control.invalid && control.dirty,
        IsDisabled: control.disabled,
        IsHorizontal: alignment === RadioAlignment.HORIZONTAL
      }"
      [attr.disabled]="control.disabled ? true : null"
      [flMarginBottom]="
        control.invalid && control.dirty ? Margin.XXXSMALL : null
      "
    >
      <ng-container *ngFor="let option of options">
        <ng-container *ngIf="isString(option)">
          <input
            class="NativeElement"
            #input
            type="radio"
            id="{{ radioGroupId }}--{{ stripSpaces(option) }}"
            name="{{ radioGroupId }}"
            [checked]="control.value === option"
            [formControl]="control"
            [value]="option"
            [attr.disabled]="control.disabled ? true : null"
          />
          <label
            class="RadioLabel"
            [attr.data-size]="size"
            [ngClass]="{ InputOnly: forListItem }"
            for="{{ radioGroupId }}--{{ stripSpaces(option) }}"
          >
            <span class="RadioEffect"></span>
            <ng-container *ngIf="!forListItem"> {{ option }} </ng-container>
          </label>
        </ng-container>
        <ng-container *ngIf="isRadioOptionItem(option)">
          <input
            class="NativeElement"
            #input
            type="radio"
            id="{{ radioGroupId }}--{{ stripSpaces(option.value) }}"
            name="{{ radioGroupId }}"
            [checked]="control.value === option.value"
            [formControl]="control"
            [value]="option.value"
            [attr.disabled]="control.disabled ? true : null"
          />
          <label
            class="RadioLabel"
            [attr.data-size]="size"
            [ngClass]="{ InputOnly: forListItem }"
            for="{{ radioGroupId }}--{{ stripSpaces(option.value) }}"
          >
            <span class="RadioEffect"></span>
            <ng-container *ngIf="!forListItem">
              {{ option.displayText }}
            </ng-container>
          </label>
        </ng-container>
      </ng-container>
    </fl-bit>

    <fl-text
      *ngIf="!forListItem && control.invalid && control.dirty"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  styleUrls: ['./radio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent implements OnInit, OnDestroy {
  Margin = Margin;
  FontColor = FontColor;
  TextSize = TextSize;
  RadioAlignment = RadioAlignment;

  radioGroupId: string;
  private statusChangeSubscription?: Rx.Subscription;

  error: string;

  @Input() control: FormControl;
  @Input() options: ReadonlyArray<string | RadioOptionItem>;
  @Input() alignment = RadioAlignment.VERTICAL;
  @Input() forListItem = false;
  @Input() size = RadioSize.SMALL;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.radioGroupId = generateRandomString();
    this.statusChangeSubscription = this.control.statusChanges.subscribe(() => {
      [this.error] = Object.values(this.control.errors || {});
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
  }

  stripSpaces(key: string) {
    return key.split(' ').join('');
  }

  isString(value: string | RadioOptionItem): value is string {
    return typeof value === 'string';
  }

  isRadioOptionItem(value: string | RadioOptionItem): value is RadioOptionItem {
    return typeof value !== 'string' && 'displayText' in value;
  }
}

function generateRandomString() {
  let text = '';
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 15; i++) {
    text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return text;
}
