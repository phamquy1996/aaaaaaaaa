import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserInsignias } from './user-insignias.transformers';
import { UserInsigniasCollection } from './user-insignias.types';

export function userInsigniasReducer(
  state: CollectionStateSlice<UserInsigniasCollection> = {},
  action: CollectionActions<UserInsigniasCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userInsignias') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserInsigniasCollection>(
          state,
          transformIntoDocuments(result.insignias, transformUserInsignias),
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
