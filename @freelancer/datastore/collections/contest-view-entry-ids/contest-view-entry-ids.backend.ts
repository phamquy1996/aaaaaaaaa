import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import {
  EntryIdFilterOption,
  EntryIdSortOption,
} from './contest-view-entry-ids.model';
import { ContestViewEntryIdsCollection } from './contest-view-entry-ids.types';

export function contestViewEntryIdsBackend(): Backend<
  ContestViewEntryIdsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'contests/getContestEntryIds.php',
      isGaf: true,
      params: {
        contest_ids: getQueryParamValue(query, 'contestId'),
        filter:
          getQueryParamValue(query, 'filter')[0] || EntryIdFilterOption.DEFAULT,
        sort: getQueryParamValue(query, 'sort')[0] || EntryIdSortOption.DEFAULT,
        entry_owner_ids: getQueryParamValue(query, 'entryOwnerIds')[0],
        entry_ids:
          query && query.searchQueryParams && query.searchQueryParams.entryIds,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
