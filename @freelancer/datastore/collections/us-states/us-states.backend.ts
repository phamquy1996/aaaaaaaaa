import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UsStatesCollection } from './us-states.types';

export function usStatesBackend(): Backend<UsStatesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'us-states/usStates.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
