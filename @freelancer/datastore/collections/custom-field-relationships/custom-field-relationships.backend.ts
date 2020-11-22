import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { CustomFieldRelationshipsCollection } from './custom-field-relationships.types';

export function customFieldRelationshipsBackend(): Backend<
  CustomFieldRelationshipsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'common/0.1/custom_field_relationships',
      isGaf: false,
      params: {
        custom_field_id: query?.searchQueryParams?.customFieldId,
        custom_field_collection_type: query?.searchQueryParams?.collectionType,
        custom_field_collection_id: query?.searchQueryParams?.collectionId,
        resource_type: query?.searchQueryParams?.resourceType,
        value_type: query?.searchQueryParams?.valueType,
        value: query?.searchQueryParams?.value,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
