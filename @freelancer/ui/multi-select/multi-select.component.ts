import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Timer, TimeUtils } from '@freelancer/time-utils';
import { IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { SelectItem } from '@freelancer/ui/select';
import { TagType } from '@freelancer/ui/tag';
import { FontColor, TextSize } from '@freelancer/ui/text';
import { dirtyAndValidate } from '@freelancer/ui/validators';
import {
  PerfectScrollbarComponent,
  PerfectScrollbarConfigInterface,
} from 'ngx-perfect-scrollbar';
import * as Rx from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Focus } from '../focus/focus.service';
import { isEqual } from '../helpers/helpers';

export enum MultiSelectSize {
  MID = 'mid',
  LARGE = 'large',
}

export enum MultiSelectBackground {
  DARK = 'dark',
  LIGHT = 'light',
}

@Component({
  selector: 'fl-multi-select',
  template: `
    <fl-bit class="MultiSelectContainer">
      <fl-bit
        class="InputContainer"
        [ngClass]="{
          Error: control.invalid && (control.touched || control.dirty),
          Disabled: control.disabled,
          IsFocused: isFocused
        }"
      >
        <fl-tag
          *ngFor="let selection of control.value"
          [type]="TagType.DISMISSABLE"
          [flMarginBottom]="Margin.XXSMALL"
          [flMarginRight]="Margin.XXSMALL"
          (dismiss)="removeItem(getOption(selection))"
        >
          {{ getOption(selection).displayText }}
        </fl-tag>
        <input
          class="RawInput"
          #rawInput
          [formControl]="inputControl"
          [attr.maxlength]="allowCustomEntry && maxLength ? maxLength : null"
          (keyup)="handleInputKeyUp($event)"
          (keydown)="handleInputKeyDown($event)"
          (focus)="handleInputFocus()"
          (blur)="handleInputBlur()"
          placeholder="{{
            placeholder && (!control.value || control.value?.length === 0)
              ? placeholder
              : secondaryPlaceholder
          }}"
        />

        <fl-bit class="DropdownContainer" *ngIf="dropdownVisible">
          <perfect-scrollbar class="DropdownScrollbar" [config]="psbConfig">
            <fl-bit
              class="DropdownItem"
              id="{{ option.displayText }}"
              *ngFor="let option of filteredOptions; let i = index"
              (click)="addItem(option)"
              [ngClass]="{
                IsHighlighted: i === highlightIndex && !option.disabled,
                IsDisabled: option.disabled
              }"
            >
              {{ option.displayText }}
            </fl-bit>
          </perfect-scrollbar>
        </fl-bit>
      </fl-bit>
      <fl-text
        *ngIf="control.invalid && (control.touched || control.dirty)"
        [ngClass]="{
          HasDarkBackground: backgroundColor === 'dark'
        }"
        [color]="FontColor.ERROR"
        [size]="TextSize.XXSMALL"
      >
        {{ error }}
      </fl-text>
    </fl-bit>
  `,
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectComponent implements OnChanges, OnDestroy, OnInit {
  FontColor = FontColor;
  TextSize = TextSize;
  IconSize = IconSize;
  Margin = Margin;
  TagType = TagType;

  @HostBinding('class.IsFocused') isFocused = false;
  error?: string;
  optionKeys: string[];
  psbConfig: PerfectScrollbarConfigInterface = {};
  dropdownVisible = false;
  filteredOptions: SelectItem[] = [];
  inputControl = new FormControl();
  highlightIndex = 0;
  inputSubscription?: Rx.Subscription;
  errorSubscription?: Rx.Subscription;
  _options: ReadonlyArray<SelectItem> = [];

  @ViewChild(PerfectScrollbarComponent)
  psbComponent: PerfectScrollbarComponent;
  @ViewChild('rawInput') rawInput: ElementRef<HTMLInputElement>;

  /**
   * Do not set this to true when options is of type SelectItem[]
   */
  @Input() allowCustomEntry = false;
  @Input() size = MultiSelectSize.MID;
  @Input() backgroundColor = MultiSelectBackground.LIGHT;
  @Input() control: FormControl;
  @Input() options: ReadonlyArray<string> | ReadonlyArray<SelectItem>;
  @Input() openDropdownOnFocus = false;

  /** default placeholder when there's no entry yet */
  @Input() placeholder?: string;

  /** placeholder when there's already an entry */
  @Input() secondaryPlaceholder = '';

  /**
   * Number of characters you can type in the input.
   * This will only work when used with allowCustomEntry
   */
  @Input() maxLength?: number;

  private dropdownHideTimeout?: Timer;

  constructor(
    private timeUtils: TimeUtils,
    private changeDetectorRef: ChangeDetectorRef,
    private focus: Focus,
  ) {}

  ngOnInit() {
    this.inputSubscription = this.inputControl.valueChanges.subscribe(v => {
      this.refilterOptions();
      this.fixupHighlightOverflow();
    });
    // Set up disabled map to actual input field
    this.control.registerOnDisabledChange(disabled => {
      if (disabled) {
        this.inputControl.disable();
      } else {
        this.inputControl.enable();
      }
    });
    // Bind the invalid control to the class var
    if (this.control.disabled) {
      this.inputControl.disable();
    }

    this.errorSubscription = this.control.statusChanges
      .pipe(startWith(this.control.status))
      .subscribe(() => {
        [this.error] = Object.values(this.control.errors || {});
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.options &&
      !this.isStringArray(this.options) &&
      this.allowCustomEntry
    ) {
      throw new Error('SelectItem[] options does not allow custom entry');
    }

    if (Object.keys(changes).includes('options')) {
      if (this.isStringArray(this.options)) {
        this._options = this.options.map(o => ({
          displayText: o,
          value: o,
        }));
      } else if (this.options && !this.isStringArray(this.options)) {
        this._options = this.options;
      }
    }
  }

  showDropdown() {
    this.dropdownVisible = true;
    // cancel closing the dropdown if we were about to
    if (this.dropdownHideTimeout) {
      clearTimeout(this.dropdownHideTimeout);
      this.dropdownHideTimeout = undefined;
    }
  }

  handleInputFocus() {
    this.isFocused = !this.isFocused;
    this.highlightIndex = 0;
    this.refilterOptions();
    if (this.openDropdownOnFocus) {
      this.showDropdown();
    }
  }

  handleInputBlur() {
    this.isFocused = false;
    // hide dropdown after a timeout so clicks still register
    this.dropdownHideTimeout = this.timeUtils.setTimeout(() => {
      this.highlightIndex = 0;
      this.dropdownVisible = false;
      this.changeDetectorRef.markForCheck();
    }, 250);
    this.rawInput.nativeElement.value = '';
  }

  handleInputKeyDown(e: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    const k = (e.key && e.key.toLowerCase()) || e.keyCode;
    if (k === 'backspace' || k === 8) {
      if (this.rawInput.nativeElement.value === '') {
        this.removeItem();
      }
    } else if (
      k === 'arrowdown' ||
      k === 'down' || // IE/Edge specific value
      k === 40 // fallback if e.key is undefined
    ) {
      // Prevent cursor from moving to the right
      e.preventDefault();
    } else if (
      k === 'arrowup' ||
      k === 'up' || // IE/Edge specific value
      k === 38 // fallback if e.key is undefined
    ) {
      // Prevent cursor from moving to the right
      e.preventDefault();
    }
  }

  handleInputKeyUp(e: KeyboardEvent) {
    // tslint:disable-next-line:deprecation
    const k = (e.key && e.key.toLowerCase()) || e.keyCode;
    // On the second letter onwards make sure dropdown is visible
    if (this.rawInput.nativeElement.value.length >= 1) {
      this.showDropdown();
    }
    // Hide it on escape and delete input value
    if (k === 'escape' || k === 27) {
      this.rawInput.nativeElement.value = '';
      this.highlightIndex = 0;
      this.dropdownVisible = false;
    } else if (k === 'enter' || k === 13) {
      if (this.dropdownVisible) {
        e.stopPropagation();
      }

      this.addItem();
    } else if (
      k === 'arrowdown' ||
      k === 'down' || // IE/Edge specific value
      k === 40 // fallback if e.key is undefined
    ) {
      if (!this.dropdownVisible) {
        this.showDropdown();
        this.moveUp();
      }
      this.moveDown();
      e.stopPropagation();
      return false;
    } else if (
      k === 'arrowup' ||
      k === 'up' || // IE/Edge specific value
      k === 38 // fallback if e.key is undefined
    ) {
      this.moveUp();
      e.stopPropagation();
      return false;
    }
  }

  fixupHighlightOverflow() {
    if (this.highlightIndex < 0) {
      this.highlightIndex += this.filteredOptions.length;
    } else if (this.highlightIndex >= this.filteredOptions.length) {
      this.highlightIndex = 0;
    }
  }

  checkForDuplicate(inputValue: string) {
    if (this.control.value) {
      const currentItems = this.control.value.map((controlValue: string) =>
        controlValue.toLowerCase(),
      );

      return currentItems.indexOf(inputValue.trim().toLowerCase()) > -1;
    }
    return false;
  }

  addItem(item?: SelectItem) {
    let itemToAdd: SelectItem | undefined;
    if (item) {
      // user clicked on an item directly
      itemToAdd = item;
    } else if (this.getItem()) {
      // user pressed enter with an item highlighted
      itemToAdd = this.getItem();
    }

    if (!itemToAdd || itemToAdd.disabled) {
      return;
    }

    const newSelections = this.control.value
      ? [...this.control.value, itemToAdd.value]
      : [itemToAdd.value];
    this.control.setValue(newSelections);
    dirtyAndValidate(this.control);
    this.highlightIndex = 0;
    this.inputControl.setValue('');
    this.refilterOptions();
    this.dropdownVisible = false;
    this.focus.focusElement(this.rawInput);
  }

  removeItem(item?: SelectItem) {
    let newSelections: SelectItem[];
    if (item === undefined) {
      newSelections = [...this.control.value];
      newSelections.pop();
    } else {
      newSelections = [...this.control.value].filter(
        i => !isEqual(i, item.value),
      );
    }
    this.control.setValue(newSelections);
    dirtyAndValidate(this.control);
    this.refilterOptions();
    this.dropdownVisible = false;
    this.focus.focusElement(this.rawInput);
  }

  scrollItemIntoView() {
    const e: any = document.getElementById(
      this.filteredOptions[this.highlightIndex].displayText,
    );
    if (e && e.scrollIntoViewIfNeeded) {
      e.scrollIntoViewIfNeeded();
    } else if (e) {
      e.scrollIntoView();
    }
  }

  getItem(): SelectItem | undefined {
    return this.dropdownVisible
      ? this.filteredOptions[this.highlightIndex]
      : undefined;
  }

  getOption(value: string | number): SelectItem {
    return (
      this._options.find(item => isEqual(item.value, value)) || {
        displayText: value.toString(),
        value,
      }
    );
  }

  refilterOptions() {
    const v = this.rawInput.nativeElement.value.trim();
    this.filteredOptions = this._options.filter(
      o =>
        o.displayText.toLowerCase().includes(v.toLowerCase()) &&
        (!this.control.value || !this.control.value.includes(o.value)),
    );
    // only show "Adding '{text}'" if filteredOptions has multiple elements
    // or empty or there is 1 filteredOptions but the displayText !== user's input
    if (
      this.allowCustomEntry &&
      v !== '' &&
      (this.filteredOptions.length !== 1 ||
        (this.filteredOptions.length === 1 &&
          this.filteredOptions[0].displayText.toLowerCase() !==
            v.toLowerCase()))
    ) {
      const duplicateDetected = this.checkForDuplicate(v);

      if (!duplicateDetected) {
        this.filteredOptions.unshift({
          displayText: `Adding '${v}'`,
          value: v,
        });
      } else {
        this.filteredOptions.unshift({
          displayText: `'${v}' is already added`,
          value: v,
          disabled: duplicateDetected,
        });
      }
    }
  }

  moveDown() {
    this.highlightIndex += 1;
    this.fixupHighlightOverflow();
    this.scrollItemIntoView();
  }

  moveUp() {
    this.highlightIndex -= 1;
    this.fixupHighlightOverflow();
    this.scrollItemIntoView();
  }

  isStringArray(
    value: ReadonlyArray<string | SelectItem> | null,
  ): value is ReadonlyArray<string> {
    return value ? typeof value[0] === 'string' : false;
  }
}
