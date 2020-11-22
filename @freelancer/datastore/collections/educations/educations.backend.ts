import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { EducationsCollection } from './educations.types';

export function educationsBackend(): Backend<EducationsCollection> {
  return {
    defaultOrder: {
      field: 'ordering',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      if (userId) {
        return {
          endpoint: `users/0.1/users/${userId}/educations/`,
          isGaf: false,
          params: {
            ordering: 'true',
          },
        };
      }
      throw new Error('Set `userId` on educations query');
    },
    push: (authUid, document) => ({
      endpoint: `users/0.1/educations`,
      payload: {
        country_code: document.countryCode,
        degree: document.degree,
        school_id: document.schoolId,
        start_date: document.startDate ? document.startDate / 1000 : undefined,
        end_date: document.endDate ? document.endDate / 1000 : undefined,
      },
    }),
    set: undefined,
    update: (authUid, delta, document) => ({
      endpoint: `users/0.1/educations/${document.id}`,
      method: 'PUT',
      payload: {
        education_id: document.id,
        country_code: delta.countryCode,
        degree: delta.degree,
        school_id: delta.schoolId,
        start_date: delta.startDate ? delta.startDate / 1000 : undefined,
        end_date: delta.endDate ? delta.endDate / 1000 : undefined,
      },
    }),
    remove: (authUid, experienceId) => ({
      endpoint: `users/0.1/educations/${experienceId}`,
      method: 'DELETE',
      payload: {},
    }),
  };
}
