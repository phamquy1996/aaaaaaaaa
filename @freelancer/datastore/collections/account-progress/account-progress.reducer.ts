import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformAccountProgress } from './account-progress.transformers';
import { AccountProgressCollection } from './account-progress.types';

export function accountProgressReducer(
  state: CollectionStateSlice<AccountProgressCollection> = {},
  action: CollectionActions<AccountProgressCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'accountProgress') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AccountProgressCollection>(
          state,
          transformIntoDocuments(
            [result.accountProgress],
            transformAccountProgress,
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
