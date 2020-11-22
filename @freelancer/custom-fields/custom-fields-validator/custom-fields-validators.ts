import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { FieldType } from '@freelancer/datastore/collections';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import * as Rx from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  switchMap,
} from 'rxjs/operators';
import { CustomFieldsValidator } from './custom-fields-validator.service';

export const validCustomFieldTextValue = (
  customFieldId: number,
  collectionType: string,
  collectionId: number,
  resourceType: ResourceTypeApi,
  customFieldValidator: CustomFieldsValidator,
  errorText: string,
): AsyncValidatorFn => (control: AbstractControl) => {
  if (!control.valueChanges) {
    return Rx.of(null);
  }

  return control.valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value =>
        customFieldValidator.validate(
          customFieldId,
          collectionType,
          collectionId,
          resourceType,
          {
            value: control.value,
            type: FieldType.STRING,
          },
        ),
      ),
      map(res => {
        if (res.status === 'error') {
          return {
            CUSTOM_FIELD_BACKEND_ERROR: `Something went wrong. Please try again or contact support@freelancer with request ID: ${res.requestId}.`,
          };
        }

        return res.result.isValid
          ? null
          : { INVALID_CUSTOM_FIELD_VALUE: errorText };
      }),
    )
    .pipe(first());
};
