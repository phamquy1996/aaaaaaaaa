import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTwoFactorDetails } from './two-factor-details.transformers';
import { TwoFactorDetailsCollection } from './two-factor-details.types';

export function twoFactorDetailsReducer(
  state: CollectionStateSlice<TwoFactorDetailsCollection> = {},
  action: CollectionActions<TwoFactorDetailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'twoFactorDetails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TwoFactorDetailsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformTwoFactorDetails,
            getQueryParamValue(ref.query, 'userId')[0],
          ),
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
