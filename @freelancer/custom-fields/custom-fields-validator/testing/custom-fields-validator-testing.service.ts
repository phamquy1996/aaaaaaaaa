import { Injectable } from '@angular/core';
import { FieldType, FieldValue } from '@freelancer/datastore/collections';
import { Interface } from '@freelancer/types';
import { ErrorCodeApi } from 'api-typings/errors/errors';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import * as Rx from 'rxjs';
import { CustomFieldsValidator } from '../custom-fields-validator.service';

export const INVALID_STRING_CUSTOM_FIELD_TESTING_VALUE =
  '10E00002-01-I1-01-9535';
export const INVALID_BOOLEAN_CUSTOM_FIELD_TESTING_VALUE = false;
export const INVALID_FLOAT_CUSTOM_FIELD_TESTING_VALUE = 0.5;
export const INVALID_INTEGER_CUSTOM_FIELD_TESTING_VALUE = 11;
export const INVALID_LAT_CUSTOM_FIELD_TESTING_VALUE = 55;
export const INVALID_LON_CUSTOM_FIELD_TESTING_VALUE = 44;
export const INVALID_TIMESTAMP_CUSTOM_FIELD_TESTING_VALUE = 44;

const CUSTOM_FIELD_VALIDATOR_INVALID_VALUE_MAP = {
  [FieldType.STRING]: { value: INVALID_STRING_CUSTOM_FIELD_TESTING_VALUE },
  [FieldType.BOOLEAN]: { value: INVALID_BOOLEAN_CUSTOM_FIELD_TESTING_VALUE },
  [FieldType.FLOAT]: { value: INVALID_FLOAT_CUSTOM_FIELD_TESTING_VALUE },
  [FieldType.INTEGER]: { value: INVALID_INTEGER_CUSTOM_FIELD_TESTING_VALUE },
  [FieldType.TIMESTAMP]: {
    value: INVALID_TIMESTAMP_CUSTOM_FIELD_TESTING_VALUE,
  },
  [FieldType.LOCATION]: {
    value: {
      latitude: INVALID_LAT_CUSTOM_FIELD_TESTING_VALUE,
      longitude: INVALID_LON_CUSTOM_FIELD_TESTING_VALUE,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class CustomFieldsValidatorTesting
  implements Interface<CustomFieldsValidator> {
  validate(
    customFieldId: number,
    collectionType: string,
    collectionId: number,
    resourceType: ResourceTypeApi,
    fieldValue: FieldValue,
  ): ReturnType<CustomFieldsValidator['validate']> {
    if (!fieldValue.type || fieldValue.type === FieldType.UNDEFINED) {
      throw new Error('FieldValue type not defined');
    }

    return Rx.of({
      status: 'success',
      result:
        CUSTOM_FIELD_VALIDATOR_INVALID_VALUE_MAP[fieldValue.type].value ===
        fieldValue.value
          ? {
              isValid: false,
              validationErrors: [
                {
                  code:
                    ErrorCodeApi.CUSTOM_FIELD_VALIDATION_VALIDATION_TYPE_INVALID,
                  detail:
                    'The validation type is invalid for custom field validations for the requested operation.',
                  http_code: 400,
                },
              ],
            }
          : { isValid: true },
    });
  }
}
