import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformCanViewEmployerProfile } from './can-view-employer-profile.transformers';
import { CanViewEmployerProfileCollection } from './can-view-employer-profile.types';

export function canViewEmployerProfileReducer(
  state: CollectionStateSlice<CanViewEmployerProfileCollection> = {},
  action: CollectionActions<CanViewEmployerProfileCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'canViewEmployerProfile') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<CanViewEmployerProfileCollection>(
          state,
          transformIntoDocuments([result], transformCanViewEmployerProfile),
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
