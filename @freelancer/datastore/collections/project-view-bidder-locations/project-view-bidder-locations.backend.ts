import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectViewBidderLocationsCollection } from './project-view-bidder-locations.types';

export function projectViewBidderLocationsBackend(): Backend<
  ProjectViewBidderLocationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: `projects/0.1/projects/${getQueryParamValue(
        query,
        'projectId',
      )}/bids`,
      isGaf: false,
      params: {
        user_details: true,
        user_location_details: true,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
