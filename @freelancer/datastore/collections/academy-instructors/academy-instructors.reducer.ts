import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformInstructors } from './academy-instructors.transformers';
import { AcademyInstructorsCollection } from './academy-instructors.types';

export function instructorsReducer(
  state: CollectionStateSlice<AcademyInstructorsCollection> = {},
  action: CollectionActions<AcademyInstructorsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyInstructors') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyInstructorsCollection>(
          state,
          transformIntoDocuments(result, transformInstructors),
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
