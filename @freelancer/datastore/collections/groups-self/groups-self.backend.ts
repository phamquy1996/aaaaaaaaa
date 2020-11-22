import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { GroupsSelfCollection } from './groups-self.types';

export function groupsSelfBackend(): Backend<GroupsSelfCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'groups/0.1/groups',
      isGaf: false,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
