import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { TagPropertiesCollection } from './tag-properties.types';

export function tagPropertiesBackend(): Backend<TagPropertiesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'discover/tagProperties.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
