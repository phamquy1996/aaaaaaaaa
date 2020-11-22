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
import { FlagSize } from '@freelancer/ui/flag';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { Margin } from '@freelancer/ui/margin';
import { PictureDisplay, PictureImage } from '@freelancer/ui/picture';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { isEqual } from '../helpers/helpers';

export enum SelectSize {
  SMALL = 'small',
  MID = 'mid',
  LARGE = 'large',
  XLARGE = 'xlarge',
}

export enum SelectBackgroundColor {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum OptionType {
  GROUP = 'group',
  INDIVIDUAL = 'individual',
  STRING = 'string',
}

export interface SelectItem {
  value: string | number | object;
  displayText: string;
  disabled?: boolean;
}

export interface SelectGroups {
  groupName: string;
  options: SelectItem[];
}

export type SelectAcceptedType = string | SelectItem | SelectGroups;

@Component({
  selector: 'fl-select',
  template: `
    <fl-bit
      class="InputContainer"
      [ngClass]="{
        Error: control.invalid && control.dirty,
        HasDarkBackground: backgroundColor === 'dark'
      }"
      [flMarginBottom]="
        control.invalid && control.dirty ? Margin.XXXSMALL : null
      "
      [attr.data-focus]="attrFocus"
      [attr.disabled]="attrDisabled"
      [attr.data-background-color]="backgroundColor"
      [attr.data-flag]="flagStartCountryCode || imageStart ? true : false"
      [attr.data-size]="size"
    >
      <fl-bit class="InputFigure" *ngIf="flagStartCountryCode || imageStart">
        <fl-flag
          *ngIf="flagStartCountryCode && !imageStart"
          [country]="flagStartCountryCode"
          [flMarginRight]="Margin.XXSMALL"
          [size]="FlagSize.SMALL"
        ></fl-flag>
        <fl-picture
          *ngIf="imageStart && !flagStartCountryCode"
          [src]="imageStart?.src"
          [alt]="imageStart?.alt"
          [boundedWidth]="true"
          [flMarginRight]="Margin.XXSMALL"
          [display]="PictureDisplay.INLINE"
        ></fl-picture>
      </fl-bit>
      <select
        #nativeElement
        class="NativeElement"
        [attr.id]="id"
        [attr.disabled]="attrDisabled"
        [attr.data-background-color]="backgroundColor"
        [attr.data-size]="size"
        [attr.data-flag]="flagStartCountryCode || imageStart ? true : false"
        [formControl]="control"
        [compareWith]="deepCompare"
        (focus)="nativeElementOnFocus($event)"
        (blur)="nativeElementOnBlur($event)"
      >
        <ng-container *ngFor="let option of options">
          <optgroup
            *ngIf="isSelectGroups(option)"
            class="OptionText"
            [label]="option.groupName"
          >
            <option
              *ngFor="let item of option.options"
              class="OptionText"
              [ngValue]="item.value"
              [disabled]="item.disabled"
            >
              {{
                item.displayText.length === 0 && placeholder
                  ? placeholder
                  : item.displayText
              }}
            </option>
          </optgroup>
          <option
            *ngIf="isSelectItem(option)"
            class="OptionText"
            [ngValue]="option.value"
            [disabled]="option.disabled"
          >
            {{
              option.displayText.length === 0 && placeholder
                ? placeholder
                : option.displayText
            }}
          </option>
          <option
            *ngIf="isString(option)"
            class="OptionText"
            [value]="option"
            [disabled]="option.length === 0 && placeholder"
          >
            {{ option.length === 0 && placeholder ? placeholder : option }}
          </option>
        </ng-container>
      </select>
      <fl-icon
        class="SelectIcon"
        [color]="backgroundColor === 'dark' ? IconColor.WHITE : IconColor.DARK"
        [name]="'ui-chevron-down'"
        [size]="IconSize.XSMALL"
      ></fl-icon>
    </fl-bit>
    <fl-text
      *ngIf="control.invalid && control.dirty"
      [ngClass]="{
        HasDarkBackground: backgroundColor === 'dark'
      }"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      {{ error }}
    </fl-text>
  `,
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent implements OnInit, OnDestroy {
  FlagSize = FlagSize;
  FontColor = FontColor;
  IconColor = IconColor;
  IconSize = IconSize;
  Margin = Margin;
  OptionType = OptionType;
  PictureDisplay = PictureDisplay;
  TextSize = TextSize;

  attrFocus?: true;
  attrDisabled?: true;
  error?: string;
  errorSubscription?: Rx.Subscription;
  @ViewChild('nativeElement') nativeElement: ElementRef<HTMLSelectElement>;
  @Input()
  set disabled(value: boolean) {
    this.attrDisabled = value ? true : undefined;
  }
  @Input() id: string;
  @Input() size = SelectSize.MID;
  @Input() backgroundColor = SelectBackgroundColor.LIGHT;
  @Input() placeholder?: string;
  @Input() control: FormControl;
  @Input() options: ReadonlyArray<SelectAcceptedType> = [];
  @Input() flagStartCountryCode?: string;
  /** Image to put in the left side of the select component */
  @Input() imageStart?: PictureImage;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.errorSubscription = this.control.statusChanges.subscribe(() => {
      [this.error] = Object.values(this.control.errors || {});
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }

  isSelectGroups(option: SelectAcceptedType): option is SelectGroups {
    return typeof option !== 'string' && 'groupName' in option;
  }

  isSelectItem(option: SelectAcceptedType): option is SelectItem {
    return typeof option !== 'string' && 'displayText' in option;
  }

  isString(option: SelectAcceptedType): option is string {
    return typeof option === 'string';
  }

  deepCompare(option: any, controlValue: any): boolean {
    return isEqual(option, controlValue);
  }

  nativeElementOnFocus(event: FocusEvent) {
    this.attrFocus = true;
  }

  nativeElementOnBlur(event: FocusEvent) {
    this.attrFocus = undefined;
  }
}
