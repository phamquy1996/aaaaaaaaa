import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  mergeWebsocketDocuments,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestFile } from './contest-files.transformers';
import { ContestFilesCollection } from './contest-files.types';

export function contestFilesReducer(
  state: CollectionStateSlice<ContestFilesCollection> = {},
  action: CollectionActions<ContestFilesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestFiles') {
        const { result, ref, order } = action.payload;
        const contestId = getQueryParamValue(ref.query, 'contestId')[0];

        if (!contestId) {
          throw new ReferenceError(
            'Missing contest ID for contest files fetch',
          );
        }

        if (!(contestId in result.contest_files)) {
          throw new Error(`Missing contest files for ${contestId} on result`);
        }

        return mergeDocuments<ContestFilesCollection>(
          state,
          transformIntoDocuments(
            result.contest_files[contestId],
            transformContestFile,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestFiles') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<ContestFilesCollection>(
          state,
          transformIntoDocuments([result], transformContestFile),
          ref,
        );
      }
      return state;
    }

    case 'API_DELETE_SUCCESS': {
      if (action.payload.type === 'contestFiles') {
        const { originalDocument, ref } = action.payload;
        return removeDocumentById<ContestFilesCollection>(
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
