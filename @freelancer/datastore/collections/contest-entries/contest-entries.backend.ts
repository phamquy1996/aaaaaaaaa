import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestEntriesCollection } from './contest-entries.types';

export function contestEntriesBackend(): Backend<ContestEntriesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/entries`,
      params: {
        entries: ids || [],
        contests: getQueryParamValue(query, 'contestId'),
        statuses: getQueryParamValue(query, 'status'),
        // Owner of contest
        owners: getQueryParamValue(query, 'contestOwnerId'),
        // Owner of entry
        entrants: getQueryParamValue(query, 'ownerId'),
        file_details: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
