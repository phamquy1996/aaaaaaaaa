import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { PortfolioItem } from './portfolios.model';
import { PortfoliosCollection } from './portfolios.types';

export function portfoliosBackend(): Backend<PortfoliosCollection> {
  return {
    defaultOrder: {
      field: 'lastModifyDate',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/portfolios/',
      isGaf: false,
      params: {
        users: getQueryParamValue(query, 'userId'),
        categories: getCategoriesQueryParamValue(query),
        type: getQueryParamValue(query, 'contentType')[0],
        featured: false,
        exclude_empty_items: true,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getCategoriesQueryParamValue(
  query: RawQuery<PortfolioItem> | undefined,
): ReadonlyArray<number> | undefined {
  return getQueryParamValue(query, 'categories', param =>
    param.condition === 'intersects' ? param.values : [],
  )[0];
}
