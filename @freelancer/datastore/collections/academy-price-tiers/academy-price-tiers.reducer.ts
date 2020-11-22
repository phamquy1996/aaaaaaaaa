import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformAcademyPriceTier } from './academy-price-tiers.transformers';
import { AcademyPriceTiersCollection } from './academy-price-tiers.types';

export function academyPriceTiersReducer(
  state: CollectionStateSlice<AcademyPriceTiersCollection> = {},
  action: CollectionActions<AcademyPriceTiersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyPriceTiers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyPriceTiersCollection>(
          state,
          transformIntoDocuments(result, transformAcademyPriceTier),
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
