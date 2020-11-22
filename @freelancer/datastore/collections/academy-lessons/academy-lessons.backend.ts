import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { AcademyLessonsCollection } from './academy-lessons.types';

export function lessonsBackend(): Backend<AcademyLessonsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getLessons.php',
      isGaf: true,
      params: {
        ids: ids || [],
        moduleIds: getQueryParamValue(query, 'moduleId'),
        moduleDetails: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
