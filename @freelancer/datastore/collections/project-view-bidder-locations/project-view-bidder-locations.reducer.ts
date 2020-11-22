import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { ProjectBidsGetResultApi } from 'api-typings/projects/projects';
import { transformProjectViewBidderLocations } from './project-view-bidder-locations.transformers';
import { ProjectViewBidderLocationsCollection } from './project-view-bidder-locations.types';

export function projectViewBidderLocationsReducer(
  state: CollectionStateSlice<ProjectViewBidderLocationsCollection> = {},
  action: CollectionActions<ProjectViewBidderLocationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectViewBidderLocations') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectViewBidderLocationsCollection>(
          state,
          transformIntoDocuments(
            pairBidAndBidder(result),
            transformProjectViewBidderLocations,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}

function pairBidAndBidder(projectBidsGetResultApi: ProjectBidsGetResultApi) {
  const bidders = projectBidsGetResultApi.users
    ? Object.values(projectBidsGetResultApi.users)
    : [];
  const bids = projectBidsGetResultApi.bids || [];
  return bids.map(bid => ({
    user: bidders.find(bidder => bidder && bidder.id === bid.bidder_id),
    bid,
  }));
}
