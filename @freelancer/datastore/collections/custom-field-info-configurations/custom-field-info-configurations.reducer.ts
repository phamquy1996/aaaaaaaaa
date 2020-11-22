import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { flatten, isDefined } from '@freelancer/utils';
import { transformCustomFieldInfosConfigurations } from './custom-field-info-configurations.transformers';
import { CustomFieldInfoConfigurationsCollection } from './custom-field-info-configurations.types';

export function customFieldInfoConfigurationsReducer(
  state: CollectionStateSlice<CustomFieldInfoConfigurationsCollection> = {},
  action: CollectionActions<CustomFieldInfoConfigurationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'customFieldInfoConfigurations') {
        const { result, ref, order } = action.payload;
        if (!result.enterprise_metadata_fields) {
          return state;
        }
        const customFieldInfoConfigurationsResult = Object.values(
          result.enterprise_metadata_fields,
        );

        if (!customFieldInfoConfigurationsResult) {
          return state;
        }

        const enterperiseCustomFieldInfoList = flatten(
          customFieldInfoConfigurationsResult.filter(isDefined),
        );

        return mergeDocuments<CustomFieldInfoConfigurationsCollection>(
          state,
          transformIntoDocuments(
            enterperiseCustomFieldInfoList,
            transformCustomFieldInfosConfigurations,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
