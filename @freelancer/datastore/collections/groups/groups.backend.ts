import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { GroupsCollection } from './groups.types';

export function groupsBackend(): Backend<GroupsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'groups/0.1/groups',
      isGaf: false,
      params: {
        group_ids: ids,
        seo_urls: [
          query?.searchQueryParams.seoUrl as string,
          ...getQueryParamValue(query, 'seoUrl'),
        ],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
    isSubscribable: true,
  };
}
