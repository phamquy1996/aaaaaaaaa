import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import {
  transformTracks,
  transformWebsocketTrackCreateEvent,
  transformWebsocketTrackPoint,
} from './tracks.transformers';
import { TracksCollection } from './tracks.types';

export function tracksReducer(
  state: CollectionStateSlice<TracksCollection> = {},
  action: CollectionActions<TracksCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tracks') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TracksCollection>(
          state,
          transformIntoDocuments(result, transformTracks),
          order,
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<TracksCollection> = {
        path: {
          collection: 'tracks',
          authUid: action.payload.toUserId,
        },
      };
      if (
        action.payload.parent_type === 'notifications' &&
        action.payload.type === 'trackUpdate'
      ) {
        const trackPoint = transformWebsocketTrackPoint(action.payload.data);
        return updateWebsocketDocuments<TracksCollection>(
          state,
          [action.payload.data.trackId],
          track => ({
            ...track,
            trackPoints: [...track.trackPoints, trackPoint],
          }),
          ref,
        );
      }

      if (
        action.payload.parent_type === 'notifications' &&
        action.payload.type === 'trackCreate'
      ) {
        return addWebsocketDocuments(
          state,
          [action.payload],
          transformWebsocketTrackCreateEvent,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
