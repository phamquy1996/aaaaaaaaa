import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CustomFieldsService,
  CustomFormFieldType,
} from '@freelancer/custom-fields';
import { Datastore } from '@freelancer/datastore';
import {
  CustomFieldRelationshipsCollection,
  DeloitteProjectPostField,
  Enterprise,
  FieldValue,
} from '@freelancer/datastore/collections';
import { HeadingType } from '@freelancer/ui/heading';
import { IconColor } from '@freelancer/ui/icon';
import { InputSize, InputType } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { SelectSize } from '@freelancer/ui/select';
import { FontColor, FontWeight, TextSize } from '@freelancer/ui/text';
import { TooltipPosition } from '@freelancer/ui/tooltip';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-deloitte-project-billing-code-input',
  template: `
    <fl-bit>
      <ng-container *ngIf="!isHireMe; else hireMe">
        <fl-custom-form-field
          labelText="WBS code (utilization or non-utilization bearing)"
          i18n-labelText="WBS code input label"
          labelHintText="Billing code will not be shared with resources until they accept the project"
          i18n-labelHintText="
             Hover tooltip help message about billing code visibility
          "
          placeholder="ABC00123-AB-01-01-1234"
          i18n-placeholder="Post Job Page form billing code format placeholder"
          [trackingLabel]="'ProjectBillingCode'"
          [type]="CustomFormFieldType.INPUT"
          [inputType]="InputType.TEXT"
          [control]="control"
          [id]="'billing-code-input'"
          [flMarginBottom]="
            control.touched && control.valid ? Margin.SMALL : Margin.NONE
          "
        ></fl-custom-form-field>
      </ng-container>
      <ng-template #hireMe>
        <fl-text
          i18n="Hire Me project WBS code label"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          WBS code (utilization or non-utilization bearing)
        </fl-text>
        <fl-input
          i18n-placeholder="Project WBS Code"
          flTrackingLabel="project billing code"
          placeholder="e.g: ABC00123-AB-01-01-1234"
          [control]="control"
        ></fl-input>
      </ng-template>

      <fl-bit *ngIf="control.touched && control.valid" class="ValidationResult">
        <fl-bit [flMarginRight]="Margin.XXSMALL">
          <fl-icon
            [name]="'ui-check-in-circle-v2'"
            [color]="IconColor.LIGHT"
          ></fl-icon>
        </fl-bit>
        <fl-text
          i18n="FSS code validated message"
          [size]="TextSize.XXSMALL"
          [weight]="FontWeight.BOLD"
          [color]="FontColor.LIGHT"
        >
          <ng-container
            *ngIf="fssMapping$ | async as fssMapping; else noFssMapping"
          >
            FSS Validated: {{ fssMapping?.value }}
          </ng-container>
          <ng-template #noFssMapping>
            FSS Validated
          </ng-template>
        </fl-text>
      </fl-bit>
    </fl-bit>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./deloitte-project-billing-code-input.component.scss'],
})
export class DeloitteProjectBillingCodeInputComponent implements OnInit {
  CustomFormFieldType = CustomFormFieldType;
  FontColor = FontColor;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  IconColor = IconColor;
  InputSize = InputSize;
  InputType = InputType;
  Margin = Margin;
  SelectSize = SelectSize;
  TextSize = TextSize;
  TooltipPosition = TooltipPosition;
  DeloitteProjectPostField = DeloitteProjectPostField;

  @Input() control: FormControl;
  @Input() isHireMe = false;

  fssMapping$: Rx.Observable<FieldValue | undefined>;

  constructor(
    private datastore: Datastore,
    private customFieldsService: CustomFieldsService,
  ) {}

  ngOnInit(): void {
    const customFieldId$ = this.customFieldsService.getCustomFieldIdByName(
      DeloitteProjectPostField.BILLING_CODE,
      ResourceTypeApi.PROJECT,
    );

    this.fssMapping$ = this.datastore
      .collection<CustomFieldRelationshipsCollection>(
        'customFieldRelationships',
        query =>
          customFieldId$.pipe(
            map(id =>
              query.search({
                customFieldId: id,
                collectionType: 'enterprise',
                collectionId: Enterprise.DELOITTE_DC,
                resourceType: ResourceTypeApi.PROJECT,
                valueType: 'varchar_small',
                value: this.control.value,
              }),
            ),
          ),
      )
      .valueChanges()
      .pipe(
        map(relationships =>
          relationships[0]?.rightValues
            ? relationships[0].rightValues[0]
            : undefined,
        ),
      );
  }
}
