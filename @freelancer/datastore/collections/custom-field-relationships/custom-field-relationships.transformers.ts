import { CustomFieldRelationshipApi } from 'api-typings/resources/custom_field_relationship';
import {
  transformFieldType,
  transformFieldValue,
} from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { CustomFieldRelationship } from './custom-field-relationships.model';

export function transformCustomFieldRelationshipApi(
  customFieldRelationshipApi: CustomFieldRelationshipApi,
): CustomFieldRelationship {
  return {
    id: customFieldRelationshipApi.id,
    name: customFieldRelationshipApi.name,
    relationshipType: customFieldRelationshipApi.relationship_type,
    singleValue: customFieldRelationshipApi.single_value,
    leftValue: transformFieldValue(customFieldRelationshipApi.left_value),
    leftValueType: transformFieldType(
      customFieldRelationshipApi.left_value_type,
    ),
    rightValueType: transformFieldType(
      customFieldRelationshipApi.right_value_type,
    ),
    rightValues: customFieldRelationshipApi.right_values
      ? customFieldRelationshipApi.right_values.map(transformFieldValue)
      : [],
  };
}
