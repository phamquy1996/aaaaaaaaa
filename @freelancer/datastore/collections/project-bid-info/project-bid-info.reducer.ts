import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectBidInfo } from './project-bid-info.transformers';
import { ProjectBidInfoCollection } from './project-bid-info.types';

export function projectBidInfoReducer(
  state: CollectionStateSlice<ProjectBidInfoCollection> = {},
  action: CollectionActions<ProjectBidInfoCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectBidInfo') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectBidInfoCollection>(
          state,
          transformIntoDocuments([result], transformProjectBidInfo),
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
