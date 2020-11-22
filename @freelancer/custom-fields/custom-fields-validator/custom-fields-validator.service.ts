import { Injectable } from '@angular/core';
import { ResponseData } from '@freelancer/datastore';
import { FieldType, FieldValue } from '@freelancer/datastore/collections';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { CustomFieldValidateValueResultApi } from 'api-typings/resources/custom_field_validation';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomFieldsValidatorResponse } from './custom-fields-validator.model';

/**
 * CustomFieldValidator is to be used to validate custom field values,
 * against predefined backend values/rules.
 *
 * If you require a custom field form input to be validated, you can used the
 * async validator: `validCustomFieldTextValue`, that uses this service.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomFieldsValidator {
  constructor(private freelancerHttp: FreelancerHttp) {}

  /**
   * Validate a given custom field value in against pre defined backend
   * rules/values.
   *
   * @param customFieldId The custom field that you are wanted to check if the value is valid for.
   * @param collectionType What collection the custom field is linked to. 'enterprise' for example.
   * @param collectionId ID of the collection that the custom field is linked to. '1' for Deloitte for example.
   * @param resourceType The type of resource the custom field is attacked to. 'PROJECT' or 'USER'.
   * @param fieldValue The value being checked.
   */
  validate(
    customFieldId: number,
    collectionType: string,
    collectionId: number,
    resourceType: ResourceTypeApi,
    fieldValue: FieldValue,
  ): Rx.Observable<
    ResponseData<CustomFieldsValidatorResponse, 'UNKNOWN_ERROR'>
  > {
    const value = { value: fieldValue.value };
    let typedValue = null;
    switch (fieldValue.type) {
      case FieldType.STRING:
        typedValue = { text_value: value };
        break;
      case FieldType.BOOLEAN:
        typedValue = { boolean_value: value };
        break;
      case FieldType.LOCATION:
        typedValue = { location_value: value };
        break;
      case FieldType.FLOAT:
        typedValue = { float_value: value };
        break;
      case FieldType.INTEGER:
        typedValue = { integer_value: value };
        break;
      case FieldType.TIMESTAMP:
        typedValue = { timestamp_value: value };
        break;
      default:
        throw new Error('Invalid FieldType given.');
    }

    return this.freelancerHttp
      .put<CustomFieldValidateValueResultApi>(
        'common/0.1/custom_field_validations/',
        {
          action: 'validate_value',
          validate_value_request: {
            custom_field: {
              custom_field_id: customFieldId,
              collection_type: collectionType,
              collection_id: collectionId,
            },
            resource_type: resourceType,
            value: typedValue,
          },
        },
      )
      .pipe(
        map(rawResult => {
          if (rawResult.status === 'error') {
            return {
              status: 'error',
              requestId: rawResult.requestId,
              errorCode: rawResult.errorCode,
            };
          }

          return {
            status: 'success',
            result: rawResult.result.is_valid
              ? {
                  isValid: true,
                }
              : {
                  isValid: false,
                  validationErrors: rawResult.result.validation_errors
                    ? rawResult.result.validation_errors
                    : [],
                },
          };
        }),
      );
  }
}
