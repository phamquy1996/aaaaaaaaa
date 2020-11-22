import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { GroupPermissionsCollection } from './group-permissions.types';

export function groupPermissionsBackend(): Backend<GroupPermissionsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    maxBatchSize: 1, // This endpoint only supports querying one document at a time.
    fetch: (authUid, ids = [], query, order) => {
      if (ids.length !== 1) {
        throw Error('Group Permissions only supports single document queries');
      }

      return {
        endpoint: `groups/0.1/groups/${ids[0]}/self/permissions/`,
        isGaf: false,
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
