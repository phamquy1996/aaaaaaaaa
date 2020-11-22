import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewHandover } from './manage-view-handovers.transformers';
import { ManageViewHandoversCollection } from './manage-view-handovers.types';

export function manageViewHandoversReducer(
  state: CollectionStateSlice<ManageViewHandoversCollection> = {},
  action: CollectionActions<ManageViewHandoversCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewHandovers') {
        const { result, ref, order } = action.payload;
        const context = {
          role: getQueryParamValue(ref.query, 'role')[0],
        };
        return mergeDocuments<ManageViewHandoversCollection>(
          state,
          transformIntoDocuments(result, transformManageViewHandover, context),
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
