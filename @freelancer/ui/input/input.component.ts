import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, FontType, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SatDatepicker } from 'saturn-datepicker';
import { HoverColor, IconColor, IconSize } from '../icon/icon.component';
import { LocalizedDateFns } from '../localized-date-fns.service';

export enum InputType {
  DATE = 'date',
  DATERANGE = 'daterange',
  EMAIL = 'email',
  NUMBER = 'number',
  PASSWORD = 'password',
  SEARCH = 'search',
  TEXT = 'text',
}

export enum InputSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
}

export enum InputBackgroundColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum InputTextAlign {
  LEFT = 'light',
  RIGHT = 'right',
}

@Component({
  selector: 'fl-input',
  template: `
    <fl-bit
      class="InputContainer"
      [ngClass]="{
        NoFill: backgroundColor === InputBackgroundColor.DARK,
        BeforeLabelPresent: beforeLabel,
        AfterLabelPresent: afterLabel,
        IsFocused: inputFocused === true,
        IsExpandable: isExpandable === true,
        SearchInput: searchInput === true,
        Error: control.invalid && (control.touched || control.dirty)
      }"
      [attr.data-size]="size"
      [attr.disabled]="attrDisabled"
      [attr.data-expanded]="expanded"
      [flMarginBottom]="
        control.invalid && (control.touched || control.dirty)
          ? Margin.XXXSMALL
          : null
      "
      #inputContainer
    >
      <fl-bit
        class="InputLabel BeforeLabel"
        *ngIf="beforeLabel"
        [attr.data-size]="size"
      >
        <span class="LabelText"> {{ beforeLabel }} </span>
      </fl-bit>

      <fl-button
        *ngIf="iconStartClickable"
        (click)="handleIconStartClick($event)"
      >
        <fl-icon
          *ngIf="iconStart"
          class="IconStart"
          [size]="leftIconSize"
          [color]="leftIconColor"
          [hoverColor]="HoverColor.PRIMARY"
          [label]="iconStartLabel"
          [name]="iconStart"
        ></fl-icon>
      </fl-button>
      <fl-icon
        *ngIf="iconStart && !iconStartClickable"
        class="IconStart"
        [size]="leftIconSize"
        [color]="leftIconColor"
        [label]="iconStartLabel"
        [name]="iconStart"
      ></fl-icon>
      <fl-bit class="NativeElementContainer">
        <ng-container *ngIf="isDateInput(); else normalInput">
          <!--
            NOTE: for [type="date"] we set the native [attr.type] to "text"
            This is to avoid the native date-picker stuff showing up
          -->
          <input
            #nativeElement
            class="NativeElement"
            [ngClass]="{
              NoFill: backgroundColor === InputBackgroundColor.DARK
            }"
            [attr.id]="id"
            [attr.type]="'text'"
            [attr.placeholder]="
              type === InputType.DATE
                ? (dateFormat | async)
                : (dateRangeFormat | async)
            "
            [attr.readonly]="attrReadonly ? true : null"
            [attr.disabled]="attrDisabled"
            [attr.maxlength]="maxLength ? maxLength : null"
            [attr.data-align]="textAlign"
            [attr.aria-label]="ariaLabel"
            [attr.autocomplete]="autocomplete ? 'on' : 'off'"
            [formControl]="control"
            [satDatepicker]="picker"
            (focus)="inputFocused = !inputFocused"
            (blur)="inputFocused = false"
          />
          <sat-datepicker
            #picker
            [rangeMode]="type === InputType.DATERANGE"
          ></sat-datepicker>
        </ng-container>
        <ng-template #normalInput>
          <!--
            this is separate because otherwise matDatepicker will add date validation
          -->
          <input
            #nativeElement
            class="NativeElement"
            [ngClass]="{
              NoFill: backgroundColor === InputBackgroundColor.DARK
            }"
            [attr.id]="id"
            [attr.type]="type"
            [attr.placeholder]="placeholder"
            [attr.readonly]="attrReadonly ? true : null"
            [attr.disabled]="attrDisabled"
            [attr.maxlength]="maxLength ? maxLength : null"
            [attr.data-align]="textAlign"
            [attr.autocomplete]="autocomplete ? 'on' : 'off'"
            [attr.aria-label]="ariaLabel"
            [formControl]="control"
            (focus)="inputFocused = !inputFocused"
            (blur)="inputFocused = false"
            (wheel)="handleInputWheel()"
          />
        </ng-template>
      </fl-bit>
      <fl-button
        class="InputButton"
        *ngIf="iconEndClickable"
        (click)="handleIconEndClick($event)"
      >
        <fl-icon
          *ngIf="iconEnd"
          class="IconEnd"
          [size]="rightIconSize"
          [color]="rightIconColor"
          [hoverColor]="HoverColor.PRIMARY"
          [label]="iconEndLabel"
          [name]="iconEnd"
        ></fl-icon>
      </fl-button>
      <fl-icon
        *ngIf="iconEnd && !iconEndClickable"
        class="IconEnd"
        [size]="rightIconSize"
        [color]="rightIconColor"
        [label]="iconEndLabel"
        [name]="iconEnd"
      ></fl-icon>

      <fl-bit
        class="InputLabel AfterLabel"
        *ngIf="afterLabel"
        [attr.data-size]="size"
      >
        <span class="LabelText"> {{ afterLabel }} </span>
      </fl-bit>
    </fl-bit>

    <fl-bit
      *ngIf="
        maxCharacter !== undefined &&
        !(control.invalid && (control.touched || control.dirty))
      "
      class="CountCharacterWrapper"
    >
      <fl-text
        i18n="description character counter"
        class="Counter"
        [ngClass]="{
          IsFocus: inputFocused
        }"
        [color]="
          maxCharacter - control.value?.length >= 0
            ? FontColor.DARK
            : FontColor.ERROR
        "
        [size]="TextSize.XSMALL"
        [fontType]="FontType.PARAGRAPH"
      >
        {{ maxCharacter - control.value?.length }}
      </fl-text>
    </fl-bit>

    <fl-text
      *ngIf="control.invalid && (control.touched || control.dirty)"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnInit, OnDestroy {
  Margin = Margin;
  FontColor = FontColor;
  FontType = FontType;
  TextSize = TextSize;
  HoverColor = HoverColor;
  InputBackgroundColor = InputBackgroundColor;
  InputType = InputType;

  attrDisabled?: true;
  error: string;
  errorSubscription?: Rx.Subscription;
  inputFocused = false;
  iconStartClickable = false;
  iconEndClickable = false;
  dateFormat: Promise<string>;
  dateRangeFormat: Promise<string>;

  @Input() expanded = false;
  @Input() id: string;
  @Input() attrReadonly?: true;
  @Input() control: FormControl;
  @Input() placeholder: string;
  @Input() size: InputSize = InputSize.MID;
  // Not for general use. This is only for search.
  // If you'd like to use this input, make sure you discuss with UI Eng
  @Input() isExpandable = false;
  @Input() type: InputType = InputType.TEXT;
  @Input() backgroundColor: InputBackgroundColor = InputBackgroundColor.LIGHT;
  @Input() iconStart: string;
  @Input() iconEnd: string;
  @Input() iconStartLabel: string;
  @Input() iconEndLabel: string;
  @Input() leftIconSize = IconSize.MID;
  @Input() leftIconColor = IconColor.INHERIT;
  @Input() rightIconSize = IconSize.MID;
  @Input() rightIconColor = IconColor.INHERIT;
  @Input() beforeLabel = '';
  @Input() afterLabel = '';
  @Input() ariaLabel?: string;
  @Input() maxLength?: number;
  @Input() maxCharacter?: number;
  @Input() textAlign: InputTextAlign = InputTextAlign.LEFT;
  // Internal use only. Adds spacing for compatibility with fl-search.
  @Input() searchInput = false;
  // Enable/disable browser autocomplete form suggestions for the input
  @Input() autocomplete = true;
  @Input()
  set disabled(value: boolean) {
    this.attrDisabled = value ? true : undefined;
    if (this.isDateInput()) {
      this.iconEndClickable = !value;
    }
  }

  @Output() iconStartClick = new EventEmitter<MouseEvent>();
  @Output() iconEndClick = new EventEmitter<MouseEvent>();

  @ViewChild('nativeElement') nativeElement: ElementRef<HTMLInputElement>;
  @ViewChild('inputContainer', { read: ElementRef })
  inputContainer: ElementRef<HTMLDivElement>;
  @ViewChild('picker') satDatepicker: SatDatepicker<Date>;

  constructor(
    private cd: ChangeDetectorRef,
    private datefns: LocalizedDateFns,
  ) {}

  ngOnInit() {
    this.dateFormat = this.datefns.dateFormat;
    this.dateRangeFormat = this.datefns.dateRangeFormat;

    this.errorSubscription = this.control.statusChanges
      .pipe(startWith(this.control.status))
      .subscribe(() => {
        if (
          (this.type === InputType.DATE || this.type === InputType.DATERANGE) &&
          this.isMatDatePickerError(this.control.errors)
        ) {
          // Material's datepicker doesn't expose a nice error string like the
          // native form controls, so use our own
          this.error = 'Please select a valid date.';
        } else {
          [this.error] = Object.values(this.control.errors || {});
        }
        this.cd.markForCheck();
      });
    // We are able to check for subscriptions to these inputs in order to infer
    // whether or not the icons should be clickable (displayed as buttons)
    this.iconStartClickable = this.iconStartClick.observers.length > 0;
    this.iconEndClickable = this.iconEndClick.observers.length > 0;

    if (this.isDateInput()) {
      // force a calendar picker icon
      this.iconEnd = 'ui-calendar-v2';
      this.iconEndClickable = !this.attrDisabled;
    }
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  isDateInput() {
    return this.type === InputType.DATE || this.type === InputType.DATERANGE;
  }

  handleIconEndClick(e: MouseEvent) {
    if (this.type === InputType.DATE || this.type === InputType.DATERANGE) {
      // open the matDatePicker instead of emitting
      // it automatically closes when you click outside
      this.satDatepicker.open();
      return;
    }

    this.iconEndClick.emit(e);
  }

  handleIconStartClick(e: MouseEvent) {
    this.iconStartClick.emit(e);
  }

  // Prevents "scrolling" inside the input type number
  handleInputWheel() {
    if (this.type === InputType.NUMBER && this.inputFocused) {
      this.nativeElement.nativeElement.blur();
    }
  }

  // Hack around Material's error format
  private isMatDatePickerError(errors: ValidationErrors | null) {
    return errors && errors.matDatepickerParse;
  }
}
