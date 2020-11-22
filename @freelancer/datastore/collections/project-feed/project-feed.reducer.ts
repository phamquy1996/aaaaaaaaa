import {
  addWebsocketDocuments,
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { isTestEntry } from '../newsfeed/newsfeed.transformers';
import {
  transformProjectFeed,
  transformProjectFeedWS,
} from './project-feed.transformers';
import { ProjectFeedCollection } from './project-feed.types';

export function projectFeedReducer(
  state = {},
  action: CollectionActions<ProjectFeedCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'projectFeed') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectFeedCollection>(
          state,
          transformIntoDocuments(result, transformProjectFeed),
          order,
          ref,
        );
      }
      return state;
    case 'WS_MESSAGE':
      if (
        action.payload.type === 'contest' ||
        action.payload.type === 'failingProject' ||
        action.payload.type === 'localJobPosted' ||
        action.payload.type === 'project' ||
        action.payload.type === 'recruiterProject' ||
        action.payload.type === 'xpContest'
      ) {
        if (isTestEntry(action.payload)) {
          return state;
        }

        return addWebsocketDocuments(
          state,
          [action.payload],
          transformProjectFeedWS,
          {
            path: {
              collection: 'projectFeed',
              authUid: action.payload.toUserId,
            },
          },
        );
      }
      return state;
    default:
      return state;
  }
}
