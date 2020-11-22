import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPostFile } from './post-files.transformers';
import { PostFilesCollection } from './post-files.types';

export function postFilesReducer(
  state: CollectionStateSlice<PostFilesCollection> = {},
  action: CollectionActions<PostFilesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'postFiles') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<PostFilesCollection>(
          state,
          transformIntoDocuments(result.attachment_files, transformPostFile),
          order,
          ref,
        );
      }

      return state;
    }

    default:
      return state;
  }
}
