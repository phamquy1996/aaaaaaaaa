import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  OrderByDirection,
  Reference,
  removeDocumentById,
} from '@freelancer/datastore/core';
import { transformWebsocketEntryCreatedEvent } from './contest-view-new-or-updated-entries.transformers';
import { ContestViewNewOrUpdatedEntriesCollection } from './contest-view-new-or-updated-entries.types';

export function contestViewNewOrUpdatedEntriesReducer(
  state: CollectionStateSlice<ContestViewNewOrUpdatedEntriesCollection> = {},
  action: CollectionActions<ContestViewNewOrUpdatedEntriesCollection>,
) {
  switch (action.type) {
    // This collection doesn't depend on an endpoint to hit first to populate
    // with `API_FETCH_SUCCESS` to `mergeDocuments` and add the list, so let's add
    // a new list based on the query at the `REQUEST_DATA` level.
    case 'REQUEST_DATA': {
      if (action.payload.type === 'contestViewNewOrUpdatedEntries') {
        return mergeDocuments(
          state,
          [],
          [{ field: 'id', direction: OrderByDirection.DESC }],
          action.payload.ref,
        );
      }

      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.parent_type === 'notifications') {
        const ref: Reference<ContestViewNewOrUpdatedEntriesCollection> = {
          path: {
            collection: 'contestViewNewOrUpdatedEntries',
            authUid: action.payload.toUserId,
          },
        };

        switch (action.payload.type) {
          case 'contestEntryCreated':
            return addWebsocketDocuments(
              state,
              [action.payload],
              transformWebsocketEntryCreatedEvent,
              ref,
            );

          default:
            return state;
        }
      }

      return state;
    }

    case 'API_DELETE': {
      if (action.payload.type === 'contestViewNewOrUpdatedEntries') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<ContestViewNewOrUpdatedEntriesCollection>(
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
