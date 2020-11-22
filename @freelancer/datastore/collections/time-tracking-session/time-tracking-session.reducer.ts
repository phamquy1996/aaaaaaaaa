import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTimeTrackingSession } from './time-tracking-session.transformers';
import { TimeTrackingSessionCollection } from './time-tracking-session.types';

export function timeTrackingSessionReducer(
  state: CollectionStateSlice<TimeTrackingSessionCollection> = {},
  action: CollectionActions<TimeTrackingSessionCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'timeTrackingSession') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TimeTrackingSessionCollection>(
          state,
          transformIntoDocuments(result.sessions, transformTimeTrackingSession),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'timeTrackingSession') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<TimeTrackingSessionCollection>(
          state,
          transformIntoDocuments(result.sessions, transformTimeTrackingSession),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'timeTrackingSession') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<TimeTrackingSessionCollection>(
          state,
          transformIntoDocuments(
            'sessions' in result ? result.sessions : [result],
            transformTimeTrackingSession,
          ),
          ref,
        );
      }
      return state;
    }
    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'timeTrackingSession') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<TimeTrackingSessionCollection>(
          ref,
          state,
          originalDocument.id,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<TimeTrackingSessionCollection> = {
        path: {
          collection: 'timeTrackingSession',
          authUid: action.payload.toUserId,
        },
      };

      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'timeTrackingSessionCreate':
            return addWebsocketDocuments(
              state,
              [action.payload.data],
              transformTimeTrackingSession,
              ref,
            );
          case 'timeTrackingSessionDelete':
            return removeDocumentById<TimeTrackingSessionCollection>(
              ref,
              state,
              action.payload.data.id,
            );
          default:
            return state;
        }
      }
      return state;
    }
    default:
      return state;
  }
}
