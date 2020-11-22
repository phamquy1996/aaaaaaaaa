import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SuperuserMilestonesCollection } from './superuser-milestones.types';

export function superuserMilestonesBackend(): Backend<
  SuperuserMilestonesCollection
> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `superuser/0.1/milestones`,
      params: {
        projects: getQueryParamValue(query, 'projectId'),
        bids: getQueryParamValue(query, 'bidId'),
        bidders: getQueryParamValue(query, 'bidderId'),
        statuses: getQueryParamValue(query, 'status'),
        milestones: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
