import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDepositPageVars } from './deposit-page-vars.transformers';
import { DepositPageVarsCollection } from './deposit-page-vars.types';

export function depositPageVarsReducer(
  state: CollectionStateSlice<DepositPageVarsCollection> = {},
  action: CollectionActions<DepositPageVarsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'depositPageVars') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DepositPageVarsCollection>(
          state,
          transformIntoDocuments([result], transformDepositPageVars),
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
