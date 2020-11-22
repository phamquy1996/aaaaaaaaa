import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserTypeInfo } from './user-type-info.transformers';
import { UserTypeInfoCollection } from './user-type-info.types';

export function userTypeInfoReducer(
  state: CollectionStateSlice<UserTypeInfoCollection> = {},
  action: CollectionActions<UserTypeInfoCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'userTypeInfo') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<UserTypeInfoCollection>(
          state,
          transformIntoDocuments([result], transformUserTypeInfo),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
