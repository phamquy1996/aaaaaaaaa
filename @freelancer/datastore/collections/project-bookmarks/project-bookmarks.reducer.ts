import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { isArray } from '@freelancer/utils';
import { transformProjectBookmarks } from './project-bookmarks.transformers';
import { ProjectBookmarksCollection } from './project-bookmarks.types';

export function projectBookmarksReducer(
  state: CollectionStateSlice<ProjectBookmarksCollection> = {},
  action: CollectionActions<ProjectBookmarksCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectBookmarks') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectBookmarksCollection>(
          state,
          transformIntoDocuments(
            // for backwards compatibility, previously we receive an object
            // but we updated the backend to always respond with an array
            // let's make sure the transformer will always receive an array
            isArray(result) ? result : [result],
            transformProjectBookmarks,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'projectBookmarks') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ProjectBookmarksCollection>(
          state,
          transformIntoDocuments([result], transformProjectBookmarks),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
