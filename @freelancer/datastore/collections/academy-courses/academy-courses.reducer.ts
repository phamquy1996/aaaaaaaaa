import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCourse } from './academy-courses.transformers';
import { AcademyCoursesCollection } from './academy-courses.types';

export function coursesReducer(
  state: CollectionStateSlice<AcademyCoursesCollection> = {},
  action: CollectionActions<AcademyCoursesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyCourses') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyCoursesCollection>(
          state,
          transformIntoDocuments(result, transformCourse),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'academyCourses') {
        const { delta, originalDocument, ref } = action.payload;
        const courseId = originalDocument.id.toString();
        const course = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          courseId,
        );
        if (!course) {
          throw new Error('Course being updated is missing in the store');
        }
        return mergeWebsocketDocuments<AcademyCoursesCollection>(
          state,
          transformIntoDocuments([courseId], () => deepSpread(course, delta)),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
