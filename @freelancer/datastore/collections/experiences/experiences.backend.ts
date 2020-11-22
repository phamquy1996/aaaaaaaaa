import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { ExperiencesCollection } from './experiences.types';

export function experiencesBackend(): Backend<ExperiencesCollection> {
  return {
    defaultOrder: {
      field: 'ordering',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      if (userId) {
        return {
          endpoint: `users/0.1/users/${userId}/experiences/`,
          params: {
            ordering: 'true',
          },
        };
      }
      throw new Error('Set `userId` on experiences query');
    },
    push: (authUid, document) => {
      if (document.title === undefined) {
        throw new Error('Title is required.');
      }
      if (document.company === undefined) {
        throw new Error('Company is required.');
      }
      if (document.startDate === undefined) {
        throw new Error('Start Date is required.');
      }
      return {
        endpoint: `users/0.1/experiences`,
        payload: {
          title: document.title,
          company: document.company,
          description: document.description,
          start_date: document.startDate / 1000,
          end_date: document.endDate ? document.endDate / 1000 : undefined,
        },
      };
    },
    set: undefined,
    update: (authUid, delta, document) => {
      if (delta.title === undefined) {
        throw new Error('Title is required.');
      }
      if (delta.company === undefined) {
        throw new Error('Company is required.');
      }
      if (delta.startDate === undefined) {
        throw new Error('Start Date is required.');
      }

      return {
        endpoint: `users/0.1/experiences/${document.id}`,
        method: 'PUT',
        payload: {
          experience_id: document.id,
          title: delta.title,
          company: delta.company,
          description: delta.description,
          start_date: delta.startDate / 1000,
          end_date: delta.endDate ? delta.endDate / 1000 : undefined,
        },
      };
    },
    remove: (authUid, experienceId) => ({
      endpoint: `users/0.1/experiences/${experienceId}`,
      method: 'DELETE',
      payload: {
        experience_id: toNumber(experienceId),
      },
    }),
  };
}
