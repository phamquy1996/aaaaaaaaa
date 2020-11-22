import { RecursivePartial } from '@freelancer/datastore';
import { assertNever, isDefined } from '@freelancer/utils';
import {
  EnterpriseMetadataFieldApi,
  EnterpriseMetadataValueApi,
  FieldTypeApi,
  MetadataFieldApi,
  MetadataValueApi,
} from 'api-typings/resources/metadata';
import {
  CustomFieldInfo,
  CustomFieldInfoConfiguration,
  CustomFieldValue,
  CustomFieldValuePayload,
  FieldType,
  FieldValue,
} from './custom-field-info-configurations.model';

export function transformCustomFieldInfosConfigurations(
  customFieldInfoConfiguration: EnterpriseMetadataFieldApi,
): CustomFieldInfoConfiguration {
  return {
    id: customFieldInfoConfiguration.id,
    enterpriseId: customFieldInfoConfiguration.enterprise_id,
    customFieldInfo: transformCustomFieldInfo(
      customFieldInfoConfiguration.metadata_field,
    ),
    defaultValue: customFieldInfoConfiguration.default_value
      ? transformFieldValue(customFieldInfoConfiguration.default_value)
      : undefined,
    searchable: customFieldInfoConfiguration.searchable,
    resourceType: customFieldInfoConfiguration.metadata_field.resource_type,
    timeCreated: customFieldInfoConfiguration.time_created
      ? customFieldInfoConfiguration.time_created * 1000
      : undefined,
    timeEnabled: customFieldInfoConfiguration.time_enabled
      ? customFieldInfoConfiguration.time_enabled * 1000
      : undefined,
  };
}

export function transformCustomFieldValues(
  customFieldValue: EnterpriseMetadataValueApi,
): CustomFieldValue {
  return {
    resourceId: customFieldValue.resource_id,
    customFieldInfoConfigurationId:
      customFieldValue.enterprise_metadata_field_id,
    isDefaultValue: customFieldValue.is_default,
    ...transformFieldValue(customFieldValue.value),
  };
}

function transformCustomFieldInfo(
  customFieldInfo: MetadataFieldApi,
): CustomFieldInfo {
  return {
    id: customFieldInfo.id,
    name: customFieldInfo.name,
    isArray: customFieldInfo.is_array ? customFieldInfo.is_array : false,
    description: customFieldInfo.description,
    resourceType: customFieldInfo.resource_type,
    fieldType: transformFieldType(customFieldInfo.field_type),
    timeCreated: customFieldInfo.time_created
      ? customFieldInfo.time_created * 1000
      : undefined,
  };
}

export function transformFieldValue(fieldValue?: MetadataValueApi): FieldValue {
  if (!isDefined(fieldValue)) {
    return {
      value: undefined,
      type: FieldType.UNDEFINED,
    };
  }

  if (fieldValue.boolean_value) {
    return {
      value: fieldValue.boolean_value.value,
      type: FieldType.BOOLEAN,
    };
  }

  if (fieldValue.float_value) {
    return {
      value: fieldValue.float_value.value,
      type: FieldType.FLOAT,
    };
  }

  if (fieldValue.integer_value) {
    return {
      value: fieldValue.integer_value.value,
      type: FieldType.INTEGER,
    };
  }

  if (fieldValue.location_value) {
    return {
      value: {
        latitude: fieldValue.location_value.latitude,
        longitude: fieldValue.location_value.longitude,
      },
      type: FieldType.LOCATION,
    };
  }

  if (fieldValue.text_value) {
    return {
      value: fieldValue.text_value.value,
      type: FieldType.STRING,
    };
  }

  if (fieldValue.timestamp_value) {
    return {
      value: fieldValue.timestamp_value.value * 1000,
      type: FieldType.INTEGER,
    };
  }
  throw new Error('Custom field value should always have a value');
}

export function transformFieldType(fieldType: FieldTypeApi): FieldType {
  switch (fieldType) {
    case FieldTypeApi.BOOLEAN:
      return FieldType.BOOLEAN;
    case FieldTypeApi.FLOAT:
      return FieldType.FLOAT;
    case FieldTypeApi.INTEGER:
      return FieldType.INTEGER;
    case FieldTypeApi.TIMESTAMP:
      return FieldType.TIMESTAMP;
    case FieldTypeApi.POINT:
      return FieldType.LOCATION;
    case FieldTypeApi.VARCHAR_SMALL:
      return FieldType.STRING;
    default:
      assertNever(fieldType, 'Unable to identify field type');
  }
}

/**
 * Transform the EnterpriseMetadataValue to CustomFieldValuePayload
 *
 * When we update the Enterprise Metadata Values of a user, we basically create a new entry of
 * these objects. Such as, if we want to update the value associated to a certain field,
 * we don't update the EnterpriseMetadataValue itself but rather create a new EnterpriseMetadataValue for it.
 *
 * Unit test to follow T196236
 */
export function transformEnterpriseMetadataValuePayload(
  customFieldValue: RecursivePartial<CustomFieldValue>,
): CustomFieldValuePayload {
  const { customFieldInfoConfigurationId, resourceId } = customFieldValue;

  if (!customFieldInfoConfigurationId || !resourceId) {
    throw new Error('Invalid Custom Field value');
  }

  if (!isDefined(customFieldValue.value)) {
    return {
      enterprise_metadata_field_id: customFieldInfoConfigurationId,
      resource_id: resourceId,
    };
  }

  switch (customFieldValue.type) {
    case FieldType.LOCATION: {
      if (
        !isDefined(customFieldValue.value) || // FIXME: T197428 Move to top check once we upgrade to TypeScript 3.9
        !isDefined(customFieldValue.value.longitude) ||
        !isDefined(customFieldValue.value.latitude)
      ) {
        throw new Error('Invalid Custom Field value');
      }
      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: {
          location_value: {
            latitude: customFieldValue.value.latitude,
            longitude: customFieldValue.value.longitude,
          },
        },
      };
    }

    case FieldType.BOOLEAN: {
      if (
        !isDefined(customFieldValue.value) // FIXME: T197428 Move to top check once we upgrade to TypeScript 3.9
      ) {
        throw new Error('Invalid Custom Field value');
      }
      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: { boolean_value: { value: customFieldValue.value } },
      };
    }

    case FieldType.FLOAT: {
      if (
        !isDefined(customFieldValue.value) // FIXME: T197428 Move to top check once we upgrade to TypeScript 3.9
      ) {
        throw new Error('Invalid Custom Field value');
      }

      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: { float_value: { value: customFieldValue.value } },
      };
    }

    case FieldType.INTEGER: {
      if (
        !isDefined(customFieldValue.value) // FIXME: T197428 Move to top check once we upgrade to TypeScript 3.9
      ) {
        throw new Error('Invalid Custom Field value');
      }

      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: { integer_value: { value: customFieldValue.value } },
      };
    }

    case FieldType.TIMESTAMP: {
      if (
        !isDefined(customFieldValue.value) // FIXME: T197428 Move to top check once we upgrade to TypeScript 3.9
      ) {
        throw new Error('Invalid Custom Field value');
      }

      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: { timestamp_value: { value: customFieldValue.value / 1000 } },
      };
    }

    case FieldType.STRING: {
      if (
        !isDefined(customFieldValue.value) // FIXME: Move to top check once we upgrade to TypeScript 3.9
      ) {
        throw new Error('Invalid Custom Field value');
      }

      return {
        enterprise_metadata_field_id: customFieldInfoConfigurationId,
        resource_id: resourceId,
        value: { text_value: { value: customFieldValue.value } },
      };
    }

    default:
      // FIXME: Move this check to the start when we upgrade to TypeScript 3.9
      throw new Error('Invalid Custom Field value');
  }
}
