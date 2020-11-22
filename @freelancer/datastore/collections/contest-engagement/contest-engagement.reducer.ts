import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { transformContestEngagement } from './contest-engagement.transformers';
import { ContestEngagementCollection } from './contest-engagement.types';

export function contestEngagementReducer(
  state: CollectionStateSlice<ContestEngagementCollection> = {},
  action: CollectionActions<ContestEngagementCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestEngagement') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestEngagementCollection>(
          state,
          transformIntoDocuments(result, transformContestEngagement),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (
        action.payload.parent_type === 'notifications' &&
        action.payload.type === 'contestEntryEngaged'
      ) {
        const ref: Reference<ContestEngagementCollection> = {
          path: {
            collection: 'contestEngagement',
            authUid: action.payload.toUserId,
          },
        };
        const id = toNumber(action.payload.data.contestId);
        return updateWebsocketDocuments<ContestEngagementCollection>(
          state,
          [id],
          engagement => ({
            ...engagement,
            totalEngageableEntries: action.payload.data.totalEngageableEntries,
            unratedEntries: action.payload.data.unratedEntries,
            engagementRatio: action.payload.data.engagementRatio,
          }),
          ref,
        );
      }

      return state;
    }

    default:
      return state;
  }
}
