import { MapCoordinates } from '@freelancer/datastore';
import {
  EnterpriseMetadataValueApi,
  ResourceTypeApi,
} from 'api-typings/resources/metadata';

/**
 * The EnterpriseCustomField collection stores the custom fields a resource have.
 * This is for the enterprise custom fields implementation
 */
export interface CustomFieldInfoConfiguration {
  readonly id: number;
  readonly enterpriseId: number;
  readonly customFieldInfo: CustomFieldInfo;
  readonly defaultValue?: FieldValue;
  readonly searchable: boolean;
  // Included it here to easily use for the query
  // It is difficult to query for resource type given that it is part
  // of CustomField
  readonly resourceType: ResourceTypeApi;
  readonly timeCreated?: number;
  readonly timeEnabled?: number;
}

export interface CustomFieldValueUpdatePayload {
  readonly enterprise_metadata_values: ReadonlyArray<CustomFieldValuePayload>;
}

export type CustomFieldValuePayload = Omit<
  EnterpriseMetadataValueApi,
  'id' | 'time_created' | 'is_default'
>;

export enum FieldType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  FLOAT = 'float',
  INTEGER = 'integer',
  TIMESTAMP = 'timestamp',
  LOCATION = 'location',
  UNDEFINED = 'undefined',
}

export interface CustomFieldInfo {
  readonly id: number;
  readonly name: string;
  readonly isArray: boolean;
  readonly description: string;
  readonly resourceType: ResourceTypeApi;
  readonly fieldType: FieldType;
  readonly timeCreated?: number;
}

export type FieldValue =
  | {
      readonly type: FieldType.STRING;
      readonly value: string;
    }
  | {
      readonly type: FieldType.BOOLEAN;
      readonly value: boolean;
    }
  | {
      readonly type: FieldType.FLOAT;
      readonly value: number;
    }
  | {
      readonly type: FieldType.INTEGER;
      readonly value: number;
    }
  | {
      readonly type: FieldType.TIMESTAMP;
      readonly value: number;
    }
  | {
      readonly type: FieldType.LOCATION;
      readonly value: MapCoordinates;
    }
  | {
      readonly type: FieldType.UNDEFINED;
      readonly value: undefined;
    };

export type CustomFieldValue = {
  readonly customFieldInfoConfigurationId: number;
  readonly resourceId: number;
  /**
   * Indicates if the CustomFieldValue is a default value for the custom field.
   * Default value is configurable at the backend.
   */
  readonly isDefaultValue: boolean;
} & FieldValue;
