import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformJobClassifier } from './job-classifier.transformers';
import { JobClassifierCollection } from './job-classifier.types';

export function jobClassifierReducer(
  state: CollectionStateSlice<JobClassifierCollection> = {},
  action: CollectionActions<JobClassifierCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'jobClassifier') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<JobClassifierCollection>(
          state,
          transformIntoDocuments(result, transformJobClassifier),
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
