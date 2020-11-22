import {
  CollectionActions,
  CollectionStateSlice,
  flatMap,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { transformPortfolioItem } from './portfolios.transformers';
import { PortfoliosCollection } from './portfolios.types';

export function portfoliosReducer(
  state: CollectionStateSlice<PortfoliosCollection> = {},
  action: CollectionActions<PortfoliosCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'portfolios') {
        const { result, ref, order } = action.payload;

        if (isDefined(result.portfolios)) {
          const portfolios = flatMap(
            Object.values(result.portfolios),
            item => item || [],
          );

          return mergeDocuments<PortfoliosCollection>(
            state,
            transformIntoDocuments(portfolios, transformPortfolioItem),
            order,
            ref,
          );
        }
      }

      return state;
    }

    default:
      return state;
  }
}
