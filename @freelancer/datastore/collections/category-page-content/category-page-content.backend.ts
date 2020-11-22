import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CategoryPageContentCollection } from './category-page-content.types';

export function categoryPageContentBackend(): Backend<
  CategoryPageContentCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'discover/categoryPageContent.php',
      isGaf: true,
      params: {
        id: ids,
        seo_url: getQueryParamValue(query, 'seoUrl'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
