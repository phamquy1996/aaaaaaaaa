import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformIpContract } from './ip-contracts.transformers';
import { IpContractsCollection } from './ip-contracts.types';

export function ipContractsReducer(
  state: CollectionStateSlice<IpContractsCollection> = {},
  action: CollectionActions<IpContractsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'ipContracts') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<IpContractsCollection>(
          state,
          transformIntoDocuments(result.contracts, transformIpContract),
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
