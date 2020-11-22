import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformRecommendedUsernames } from './recommended-usernames.transformers';
import { RecommendedUsernamesCollection } from './recommended-usernames.types';

export function recommendedUsernamesReducer(
  state: CollectionStateSlice<RecommendedUsernamesCollection> = {},
  action: CollectionActions<RecommendedUsernamesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'recommendedUsernames') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<RecommendedUsernamesCollection>(
          state,
          transformIntoDocuments(
            [result.recommended_name, ...result.alternate_names],
            transformRecommendedUsernames,
            getQueryParamValue(ref.query, 'email')[0],
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
