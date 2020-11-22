import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestInterestedFreelancer } from './contest-interested-freelancers.transformers';
import { ContestInterestedFreelancersCollection } from './contest-interested-freelancers.types';

export function contestInterestedFreelancersReducer(
  state: CollectionStateSlice<ContestInterestedFreelancersCollection> = {},
  action: CollectionActions<ContestInterestedFreelancersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestInterestedFreelancers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestInterestedFreelancersCollection>(
          state,
          transformIntoDocuments(result, transformContestInterestedFreelancer),
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
