import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBanners } from './banners.transformers';
import { BannersCollection } from './banners.types';

export function bannersReducer(
  state: CollectionStateSlice<BannersCollection> = {},
  action: CollectionActions<BannersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'banners') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BannersCollection>(
          state,
          transformIntoDocuments([result.banner], transformBanners),
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
