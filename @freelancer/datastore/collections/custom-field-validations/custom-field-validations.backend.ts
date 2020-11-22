import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CustomFieldValidationsCollection } from './custom-field-validations.types';

export function customFieldValidationsBackend(): Backend<
  CustomFieldValidationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'common/0.1/custom_field_validations',
      isGaf: false,
      params: {
        custom_fields: getQueryParamValue(query, 'customFieldId'),
        custom_field_collection_type: getQueryParamValue(
          query,
          'collectionType',
        )[0],
        custom_field_collection_id: getQueryParamValue(
          query,
          'collectionId',
        )[0],
        resource_type: query?.searchQueryParams?.resource_type,
        validation_value_limit:
          query?.searchQueryParams?.validation_value_limit,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
