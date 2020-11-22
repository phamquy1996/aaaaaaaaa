import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformExams } from './exams.transformers';
import { ExamsCollection } from './exams.types';

export function examsReducer(
  state: CollectionStateSlice<ExamsCollection> = {},
  action: CollectionActions<ExamsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'exams') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ExamsCollection>(
          state,
          transformIntoDocuments(result, transformExams),
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
