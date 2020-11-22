import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformLessons } from './academy-lessons.transformers';
import { AcademyLessonsCollection } from './academy-lessons.types';

export function lessonsReducer(
  state: CollectionStateSlice<AcademyLessonsCollection> = {},
  action: CollectionActions<AcademyLessonsCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyLessons') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyLessonsCollection>(
          state,
          transformIntoDocuments(result, transformLessons),
          order,
          ref,
        );
      }
      return state;
    }

    // Add other action types here (see `actions.ts`)
    // case 'API_PUSH_SUCCESS': {
    //   return state;
    // }

    default:
      return state;
  }
}
