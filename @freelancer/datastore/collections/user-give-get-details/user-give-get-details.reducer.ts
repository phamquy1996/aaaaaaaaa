import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserGiveGetDetails } from './user-give-get-details.transformers';
import { UserGiveGetDetailsCollection } from './user-give-get-details.types';

export function userGiveGetDetailsReducer(
  state: CollectionStateSlice<UserGiveGetDetailsCollection> = {},
  action: CollectionActions<UserGiveGetDetailsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userGiveGetDetails') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserGiveGetDetailsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserGiveGetDetails,
            ref.path.authUid,
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
