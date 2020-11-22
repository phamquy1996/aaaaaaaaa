import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserRecentProjectsAndContests } from './user-recent-projects-and-contests.transformers';
import { UserRecentProjectsAndContestsCollection } from './user-recent-projects-and-contests.types';

export function userRecentProjectsAndContestsReducer(
  state = {},
  action: CollectionActions<UserRecentProjectsAndContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'userRecentProjectsAndContests') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserRecentProjectsAndContestsCollection>(
          state,
          transformIntoDocuments(
            result.list,
            transformUserRecentProjectsAndContests,
          ),
          order,
          ref,
        );
      }
      return state;
    default:
      return state;
  }
}
