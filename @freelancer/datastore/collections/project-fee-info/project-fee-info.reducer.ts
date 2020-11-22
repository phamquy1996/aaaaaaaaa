import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectFeeInfo } from './project-fee-info.transformers';
import { ProjectFeeInfoCollection } from './project-fee-info.types';

export function projectFeeInfoReducer(
  state: CollectionStateSlice<ProjectFeeInfoCollection> = {},
  action: CollectionActions<ProjectFeeInfoCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectFeeInfo') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ProjectFeeInfoCollection>(
          state,
          transformIntoDocuments(result, transformProjectFeeInfo),
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
