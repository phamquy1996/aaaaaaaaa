import {
  CustomFieldValidationApi,
  CustomFieldValidationValueApi,
} from 'api-typings/resources/custom_field_validation';
import {
  transformFieldType,
  transformFieldValue,
} from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import {
  CustomFieldValidation,
  CustomFieldValidationValue,
} from './custom-field-validations.model';

export function transformCustomFieldValidation(
  customFieldValidationApi: CustomFieldValidationApi,
): CustomFieldValidation {
  if (customFieldValidationApi.id === undefined) {
    throw new Error('Custom field validation was returned without an ID');
  }

  return {
    collectionId: customFieldValidationApi.custom_field.collection_id,
    collectionType: customFieldValidationApi.custom_field.collection_type,
    customFieldId: customFieldValidationApi.custom_field.custom_field_id,
    id: customFieldValidationApi.id,
    validationType: customFieldValidationApi.validation_type,
    validationValueType: transformFieldType(
      customFieldValidationApi.validation_value_type,
    ),
    validationValues: customFieldValidationApi.validation_values.map(
      transformCustomFieldValidationValue,
    ),
    partialValues: customFieldValidationApi.partial_values,
  };
}

export function transformCustomFieldValidationValue(
  customFieldValidationValueApi: CustomFieldValidationValueApi,
): CustomFieldValidationValue {
  if (customFieldValidationValueApi.id === undefined) {
    throw new Error('Custom field validation value was returned without an ID');
  }

  return {
    id: customFieldValidationValueApi.id,
    value: transformFieldValue(customFieldValidationValueApi.value),
  };
}
