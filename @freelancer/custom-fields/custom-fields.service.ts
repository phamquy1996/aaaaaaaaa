import { Injectable } from '@angular/core';
import {
  Datastore,
  DatastoreCollection,
  MapCoordinates,
  RequestStatus,
} from '@freelancer/datastore';
import {
  CustomFieldInfoConfiguration,
  CustomFieldInfoConfigurationsCollection,
  CustomFieldValue,
  FieldType,
} from '@freelancer/datastore/collections';
import { assertNever, fromPairs, isDefined } from '@freelancer/utils';
import { ResourceTypeApi } from 'api-typings/resources/metadata';
import * as Rx from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  CustomField,
  CustomFieldType,
  ResourceCustomField,
} from './custom-fields.model';

export interface MergedResourceCustomField {
  readonly valueChanges$: Rx.Observable<ResourceCustomField>;
  readonly status$: Rx.Observable<
    RequestStatus<CustomFieldInfoConfigurationsCollection>
  >;
}

/**
 * Service which provides an interface with Custom Fields.
 * This is because it requires 2 different types of collections.
 * - CustomFieldInfoConfiguration
 * -- Contains the information about the actual custom field like validation
 * and default value.
 * - CustomFieldValues
 * -- This is the actual value for a specific custom field. It will have an
 * ID which links to a specific custom field from
 * `CustomFieldInfoConfiguration`.
 */
@Injectable({
  providedIn: 'root',
})
export class CustomFieldsService {
  private isInitialized = false;
  private userCustomFieldInfoConfigurationCollection: DatastoreCollection<
    CustomFieldInfoConfigurationsCollection
  >;

  private projectCustomFieldInfoConfigurationCollection: DatastoreCollection<
    CustomFieldInfoConfigurationsCollection
  >;

  constructor(private datastore: Datastore) {}

  // This should be doing the datastore call for `CustomFieldInfoConfigurations`
  // for the different resource type.
  private init(): void {
    this.userCustomFieldInfoConfigurationCollection = this.datastore.collection<
      CustomFieldInfoConfigurationsCollection
    >('customFieldInfoConfigurations', query =>
      query.where('resourceType', '==', ResourceTypeApi.USER),
    );

    this.projectCustomFieldInfoConfigurationCollection = this.datastore.collection<
      CustomFieldInfoConfigurationsCollection
    >('customFieldInfoConfigurations', query =>
      query.where('resourceType', '==', ResourceTypeApi.PROJECT),
    );

    this.isInitialized = true;
  }

  getCustomFieldIdByName(
    customFieldName: string,
    resourceType: ResourceTypeApi,
  ): Rx.Observable<number> {
    if (!this.isInitialized) {
      this.init();
    }

    return (resourceType === ResourceTypeApi.PROJECT
      ? this.projectCustomFieldInfoConfigurationCollection
      : this.userCustomFieldInfoConfigurationCollection
    )
      .valueChanges()
      .pipe(
        map(
          customFieldInfoConfigs =>
            customFieldInfoConfigs.find(
              customFieldInfoConfig =>
                customFieldInfoConfig.customFieldInfo.name === customFieldName,
            )?.customFieldInfo.id,
        ),
        filter(isDefined),
      );
  }

  /**
   * getCustomFields returns the custom fields of a resource and the status stream for error handling
   */
  getCustomFields(
    customFieldValues$: Rx.Observable<ReadonlyArray<CustomFieldValue>>,
    resourceType: ResourceTypeApi,
    resourceId$: Rx.Observable<number>,
  ): MergedResourceCustomField {
    if (!this.isInitialized) {
      this.init();
    }

    let customFieldInfoConfiguration$: Rx.Observable<ReadonlyArray<
      CustomFieldInfoConfiguration
    >>;
    let statusStream$: Rx.Observable<RequestStatus<
      CustomFieldInfoConfigurationsCollection
    >>;

    // Handler custom fields of a certain resource type
    switch (resourceType) {
      case ResourceTypeApi.USER:
        customFieldInfoConfiguration$ = this.userCustomFieldInfoConfigurationCollection.valueChanges();
        statusStream$ = this.userCustomFieldInfoConfigurationCollection.status$;
        break;
      case ResourceTypeApi.PROJECT:
        customFieldInfoConfiguration$ = this.projectCustomFieldInfoConfigurationCollection.valueChanges();
        statusStream$ = this.projectCustomFieldInfoConfigurationCollection
          .status$;
        break;
      default:
        assertNever(resourceType, 'Unknown resource type');
    }

    const resourceCustomField$ = Rx.combineLatest([
      customFieldInfoConfiguration$,
      customFieldValues$,
      resourceId$,
    ]).pipe(
      map(([customFieldInfoConfiguration, customFieldValues, resourceId]) =>
        this.mergeFieldsAndValues(
          customFieldInfoConfiguration,
          customFieldValues,
          resourceId,
          resourceType,
        ),
      ),
    );

    return {
      valueChanges$: resourceCustomField$,
      status$: statusStream$,
    };
  }

  /**
   * @private
   * Merge all the values to their dedicated fields.
   */
  mergeFieldsAndValues(
    customFieldInfoConfiguration: ReadonlyArray<CustomFieldInfoConfiguration>,
    customFieldValues: ReadonlyArray<CustomFieldValue>,
    resourceId: number,
    resourceType: ResourceTypeApi,
  ): ResourceCustomField {
    const outlier = customFieldValues.filter(
      value => value.resourceId !== resourceId,
    );
    if (outlier.length) {
      throw new Error('All values should belong to a single resource');
    }

    const customField = fromPairs(
      customFieldInfoConfiguration.map(customFieldInfo => {
        const valuesForCurrentField = customFieldValues.filter(
          customFieldValue =>
            customFieldValue.customFieldInfoConfigurationId ===
              customFieldInfo.id && customFieldValue.value,
        );

        if (!valuesForCurrentField.length) {
          return [customFieldInfo.customFieldInfo.name, undefined];
        }

        return [
          customFieldInfo.customFieldInfo.name,
          this.buildCustomField(customFieldInfo, valuesForCurrentField),
        ];
      }),
    );

    return {
      resourceId,
      resourceType,
      customField,
    };
  }

  /**
   * @private
   * Build the custom field from the field and the values (sometimes the field has multiple values)
   */
  buildCustomField(
    field: CustomFieldInfoConfiguration,
    values: ReadonlyArray<CustomFieldValue>,
  ): CustomField {
    const { fieldType, isArray } = field.customFieldInfo;

    switch (fieldType) {
      case FieldType.BOOLEAN: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.BOOLEAN_ARRAY,
            value: values.map(mValue => mValue.value as boolean),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.BOOLEAN,
          value: values[0].value as boolean,
        };
      }
      case FieldType.FLOAT: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.FLOAT_ARRAY,
            value: values.map(mValue => mValue.value as number),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.FLOAT,
          value: values[0].value as number,
        };
      }

      case FieldType.INTEGER: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.INTEGER_ARRAY,
            value: values.map(mValue => mValue.value as number),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.INTEGER,
          value: values[0].value as number,
        };
      }

      case FieldType.LOCATION: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.LOCATION_ARRAY,
            value: values.map(mValue => mValue.value as MapCoordinates),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.LOCATION,
          value: values[0].value as MapCoordinates,
        };
      }

      case FieldType.STRING: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.STRING_ARRAY,
            value: values.map(mValue => mValue.value as string),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.STRING,
          value: values[0].value as string,
        };
      }

      case FieldType.TIMESTAMP: {
        if (isArray) {
          return {
            id: field.id,
            resourceId: values[0].resourceId,
            field,
            type: CustomFieldType.TIMESTAMP_ARRAY,
            value: values.map(mValue => mValue.value as number),
          };
        }
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.TIMESTAMP,
          value: values[0].value as number,
        };
      }
      case FieldType.UNDEFINED: {
        return {
          id: field.id,
          resourceId: values[0].resourceId,
          field,
          type: CustomFieldType.UNDEFINED,
          value: undefined,
        };
      }
      default:
        assertNever(fieldType, 'Unknown field type');
    }
  }
}
