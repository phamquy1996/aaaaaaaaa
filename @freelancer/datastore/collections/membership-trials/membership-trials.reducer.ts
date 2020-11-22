import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipTrials } from './membership-trials.transformers';
import { MembershipTrialsCollection } from './membership-trials.types';

export function membershipTrialsReducer(
  state: CollectionStateSlice<MembershipTrialsCollection> = {},
  action: CollectionActions<MembershipTrialsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipTrials') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipTrialsCollection>(
          state,
          transformIntoDocuments(result, transformMembershipTrials),
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
