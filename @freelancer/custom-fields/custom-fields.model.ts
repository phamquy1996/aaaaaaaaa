import { MapCoordinates } from '@freelancer/datastore';
import { CustomFieldInfoConfiguration } from '@freelancer/datastore/collections';
import { ResourceTypeApi } from 'api-typings/resources/metadata';

/**
 * This represents a resource that has the Resource Custom Field associated to it.
 */
export interface ResourceCustomField {
  readonly resourceId: number;
  readonly resourceType: ResourceTypeApi;
  readonly customField: {
    readonly [name: string]: CustomField | undefined; // undefined because it's possible that a field has no values at all
  };
}

export enum CustomFieldType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  FLOAT = 'float',
  INTEGER = 'integer',
  TIMESTAMP = 'timestamp',
  LOCATION = 'location',
  STRING_ARRAY = 'stringArray',
  BOOLEAN_ARRAY = 'booleanArray',
  FLOAT_ARRAY = 'floatArray',
  INTEGER_ARRAY = 'integerArray',
  TIMESTAMP_ARRAY = 'timestampArray',
  LOCATION_ARRAY = 'locationArray',
  UNDEFINED = 'undefined',
}

/**
 * This represents a ready to use Enterprise Metadata with data from
 * both the value and field.
 */
export type CustomField = {
  readonly id: number;
  readonly resourceId: number;
  readonly field: CustomFieldInfoConfiguration;
} & (
  | {
      readonly type: CustomFieldType.STRING;
      readonly value: string;
    }
  | {
      readonly type: CustomFieldType.STRING_ARRAY;
      readonly value: ReadonlyArray<string>;
    }
  | {
      readonly type: CustomFieldType.BOOLEAN;
      readonly value: boolean;
    }
  | {
      readonly type: CustomFieldType.BOOLEAN_ARRAY;
      readonly value: ReadonlyArray<boolean>;
    }
  | {
      readonly type: CustomFieldType.FLOAT;
      readonly value: number;
    }
  | {
      readonly type: CustomFieldType.FLOAT_ARRAY;
      readonly value: ReadonlyArray<number>;
    }
  | {
      readonly type: CustomFieldType.INTEGER;
      readonly value: number;
    }
  | {
      readonly type: CustomFieldType.INTEGER_ARRAY;
      readonly value: ReadonlyArray<number>;
    }
  | {
      readonly type: CustomFieldType.TIMESTAMP;
      readonly value: number;
    }
  | {
      readonly type: CustomFieldType.TIMESTAMP_ARRAY;
      readonly value: ReadonlyArray<number>;
    }
  | {
      readonly type: CustomFieldType.LOCATION;
      readonly value: MapCoordinates;
    }
  | {
      readonly type: CustomFieldType.LOCATION_ARRAY;
      readonly value: ReadonlyArray<MapCoordinates>;
    }
  | {
      readonly type: CustomFieldType.UNDEFINED;
      readonly value: undefined;
    }
);
