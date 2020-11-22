import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ContestViewNewOrUpdatedEntriesCollection } from './contest-view-new-or-updated-entries.types';

export function contestViewNewOrUpdatedEntriesBackend(): Backend<
  ContestViewNewOrUpdatedEntriesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: undefined,
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
