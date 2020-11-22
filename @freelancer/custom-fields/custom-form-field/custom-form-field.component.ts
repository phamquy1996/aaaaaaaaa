import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconColor, IconSize } from '@freelancer/ui/icon';
import { InputSize, InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import {
  SelectAcceptedType,
  SelectItem,
  SelectSize,
} from '@freelancer/ui/select';
import { TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';

export enum CustomFormFieldType {
  CHECKBOX = 'checkbox',
  INPUT = 'input',
  LOCATION = 'location',
  MULTI_SELECT = 'multi_select',
  SELECT = 'select',
}

export interface CustomFormSelectField {
  type: CustomFormFieldType.SELECT;
  options?: ReadonlyArray<SelectAcceptedType>;
}

export interface CustomFormMultiSelectField {
  type: CustomFormFieldType.MULTI_SELECT;
  // It can't be mixed array based on logic in multi-select.component
  options?: ReadonlyArray<string> | ReadonlyArray<SelectItem>;
}

export type CustomFormFieldWithOptions =
  | CustomFormSelectField
  | CustomFormMultiSelectField;

@Component({
  selector: 'fl-custom-form-field',
  template: `
    <fl-bit *ngIf="id && labelText" [flMarginBottom]="Margin.XXSMALL">
      <fl-label [for]="id" [size]="TextSize.XSMALL">
        {{ labelText }}

        <fl-tooltip
          *ngIf="labelHintText"
          [message]="labelHintText"
          [position]="TooltipPosition.TOP_CENTER"
        >
          <fl-icon [name]="'ui-info-v2'" [size]="IconSize.SMALL"></fl-icon>
        </fl-tooltip>
      </fl-label>
    </fl-bit>

    <fl-checkbox
      *ngIf="type === CustomFormFieldType.CHECKBOX"
      [flTrackingLabel]="trackingLabel"
      [control]="control"
      [label]="labelText"
    ></fl-checkbox>

    <fl-input
      *ngIf="type === CustomFormFieldType.INPUT"
      [flTrackingLabel]="trackingLabel"
      [id]="id"
      [control]="control"
      [placeholder]="placeholder"
      [type]="inputType"
      [size]="InputSize.LARGE"
      [afterLabel]="inputAfterLabel"
      [autocomplete]="inputType !== InputType.DATE"
    ></fl-input>

    <fl-select
      *ngIf="selectField && selectField.type === CustomFormFieldType.SELECT"
      [flTrackingLabel]="trackingLabel"
      [id]="id"
      [control]="control"
      [placeholder]="placeholder"
      [size]="SelectSize.LARGE"
      [options]="selectField.options"
    ></fl-select>

    <fl-location-input
      *ngIf="type === CustomFormFieldType.LOCATION"
      [flTrackingLabel]="trackingLabel"
      [id]="id"
      [control]="control"
      [displayPostalCode]="true"
      [inputSize]="InputSize.LARGE"
    ></fl-location-input>

    <fl-multi-select
      *ngIf="
        selectField && selectField.type === CustomFormFieldType.MULTI_SELECT
      "
      [flTrackingLabel]="trackingLabel"
      [id]="id"
      [control]="control"
      [placeholder]="placeholder"
      [secondaryPlaceholder]="placeholder"
      [options]="selectField.options"
    ></fl-multi-select>
  `,
  styleUrls: ['./custom-form-field.component.scss'],
})
export class CustomFormFieldComponent implements OnChanges {
  CustomFormFieldType = CustomFormFieldType;
  IconColor = IconColor;
  IconSize = IconSize;
  InputSize = InputSize;
  InputType = InputType;
  Margin = Margin;
  SelectSize = SelectSize;
  TextSize = TextSize;
  TooltipPosition = TooltipPosition;

  @Input() type: CustomFormFieldType;
  @Input() control: FormControl;
  @Input() controlValue?: string | number;
  @Input() trackingLabel?: string;
  @Input() id?: string;
  @Input() placeholder?: string;
  @Input() labelText?: string;
  @Input() labelHintText?: string;
  @Input() inputType?: InputType;
  @Input() inputAfterLabel?: string;
  @Input() selectOptions?: ReadonlyArray<SelectAcceptedType>;

  selectField?: CustomFormFieldWithOptions;

  ngOnChanges(changes: SimpleChanges) {
    if ('type' in changes || 'selectOptions' in changes) {
      const selectOptions = this.selectOptions ?? [];
      const stringOptions = selectOptions.filter(
        this.isMultiselectStringOption,
      );
      const selectItemOptions = selectOptions.filter(
        this.isMultiselectSelectItemOption,
      );

      switch (this.type) {
        case CustomFormFieldType.SELECT:
          this.selectField = {
            type: CustomFormFieldType.SELECT,
            options: selectOptions,
          };
          break;
        case CustomFormFieldType.MULTI_SELECT:
          this.selectField = {
            type: CustomFormFieldType.MULTI_SELECT,
            options:
              stringOptions && stringOptions.length
                ? stringOptions
                : selectItemOptions,
          };
          break;
        default:
          this.selectField = undefined;
      }
    }
  }

  isMultiselectStringOption(option: SelectAcceptedType): option is string {
    return typeof option === 'string';
  }

  isMultiselectSelectItemOption(
    option: SelectAcceptedType,
  ): option is SelectItem {
    return typeof option !== 'string' && 'value' in option;
  }
}
