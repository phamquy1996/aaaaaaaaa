import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDeloitteUserInfo } from './deloitte-user-info.transformers';
import { DeloitteUserInfoCollection } from './deloitte-user-info.types';

export function deloitteUserInfoReducer(
  state: CollectionStateSlice<DeloitteUserInfoCollection> = {},
  action: CollectionActions<DeloitteUserInfoCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'deloitteUserInfo') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DeloitteUserInfoCollection>(
          state,
          transformIntoDocuments(result.result, transformDeloitteUserInfo),
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
