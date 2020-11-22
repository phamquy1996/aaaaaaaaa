import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectFeed } from '../project-feed/project-feed.transformers';
import { ProjectFeedFailingContestsCollection } from './project-feed-failing-contests.types';

export function projectFeedFailingContestsReducer(
  state = {},
  action: CollectionActions<ProjectFeedFailingContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'projectFeedFailingContests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectFeedFailingContestsCollection>(
          state,
          transformIntoDocuments(result, transformProjectFeed),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
