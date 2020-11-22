import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformModule } from './academy-modules.transformers';
import { AcademyModulesCollection } from './academy-modules.types';

export function modulesReducer(
  state: CollectionStateSlice<AcademyModulesCollection> = {},
  action: CollectionActions<AcademyModulesCollection>,
) {
  switch (action.type) {
    // Network request fetched items successfully, merge them into the state
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'academyModules') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<AcademyModulesCollection>(
          state,
          transformIntoDocuments(result, transformModule),
          order,
          ref,
        );
      }
      return state;
    }

    // Add other action types here (see `actions.ts`)
    // case 'API_PUSH_SUCCESS': {
    //   return state;
    // }

    default:
      return state;
  }
}
