import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformGroup } from '../groups/groups.transformers';
import { GroupsSelfCollection } from './groups-self.types';

export function groupsSelfReducer(
  state: CollectionStateSlice<GroupsSelfCollection> = {},
  action: CollectionActions<GroupsSelfCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'groupsSelf') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<GroupsSelfCollection>(
          state,
          transformIntoDocuments(result.groups, transformGroup),
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
