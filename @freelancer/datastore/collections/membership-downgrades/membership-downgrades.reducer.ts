import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMembershipDowngrades } from './membership-downgrades.transformers';
import { MembershipDowngradesCollection } from './membership-downgrades.types';

export function membershipDowngradesReducer(
  state: CollectionStateSlice<MembershipDowngradesCollection> = {},
  action: CollectionActions<MembershipDowngradesCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'membershipDowngrades') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<MembershipDowngradesCollection>(
          state,
          transformIntoDocuments(
            result.downgrades,
            transformMembershipDowngrades,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'membershipDowngrades') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<MembershipDowngradesCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
