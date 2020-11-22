import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { PublicationsCollection } from './publications.types';

export function publicationsBackend(): Backend<PublicationsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      if (userId) {
        return {
          endpoint: `users/0.1/users/${userId}/publications/`,
          isGaf: false,
          params: {},
        };
      }
      throw new Error('Set `userId` on publications query');
    },
    push: (authUid, document) => {
      if (document.title === undefined) {
        throw new Error('Title is required.');
      }

      return {
        endpoint: `users/0.1/publications`,
        payload: {
          title: document.title,
          publisher: document.publisher,
          author: document.author,
          summary: document.summary,
          publish_date: document.publishDate
            ? document.publishDate / 1000
            : undefined,
        },
      };
    },
    set: undefined,
    update: (authUid, delta, document) => {
      if (delta.title === undefined) {
        throw new Error('Title is required.');
      }

      return {
        endpoint: `users/0.1/publications/${document.id}`,
        method: 'PUT',
        payload: {
          publication_id: document.id,
          title: delta.title,
          publisher: delta.publisher,
          author: delta.author,
          summary: delta.summary,
          publish_date: delta.publishDate
            ? delta.publishDate / 1000
            : undefined,
        },
      };
    },
    remove: (authUid, publicationId) => ({
      endpoint: `users/0.1/publications/${publicationId}`,
      method: 'DELETE',
      payload: {
        publication_id: toNumber(publicationId),
      },
    }),
  };
}
