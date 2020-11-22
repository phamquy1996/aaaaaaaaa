import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDashboardPolls } from './dashboard-polls.transformers';
import { DashboardPollsCollection } from './dashboard-polls.types';

export function dashboardPollsReducer(
  state: CollectionStateSlice<DashboardPollsCollection> = {},
  action: CollectionActions<DashboardPollsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'dashboardPolls') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DashboardPollsCollection>(
          state,
          transformIntoDocuments(result.polls, transformDashboardPolls),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'dashboardPolls') {
        const { delta, originalDocument, ref } = action.payload;
        const pollId = originalDocument.id.toString();
        const poll = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          pollId,
        );

        if (!poll) {
          throw new Error('Poll was not found in the store.');
        }

        return mergeWebsocketDocuments<DashboardPollsCollection>(
          state,
          transformIntoDocuments([pollId], () => ({
            ...poll,
            answered: delta.answered || false,
          })),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
