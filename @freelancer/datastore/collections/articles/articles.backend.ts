import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ArticlesCollection } from './articles.types';

export function articlesBackend(): Backend<ArticlesCollection> {
  return {
    defaultOrder: {
      field: 'createTime',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/articles',
      method: 'GET',
      isGaf: false,
      params: {
        users: getQueryParamValue(query, 'userId'),
        article_ids: ids,
        states: getQueryParamValue(query, 'state'),
        types: getQueryParamValue(query, 'type'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
