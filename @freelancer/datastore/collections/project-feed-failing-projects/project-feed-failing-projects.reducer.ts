import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectFeed } from '../project-feed/project-feed.transformers';
import { ProjectFeedFailingProjectsCollection } from './project-feed-failing-projects.types';

export function projectFeedFailingProjectsReducer(
  state = {},
  action: CollectionActions<ProjectFeedFailingProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'projectFeedFailingProjects') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectFeedFailingProjectsCollection>(
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
