import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformManageViewContestHandover } from './manage-view-contest-handovers.transformers';
import { ManageViewContestHandoversCollection } from './manage-view-contest-handovers.types';

export function manageViewContestHandoversReducer(
  state: CollectionStateSlice<ManageViewContestHandoversCollection> = {},
  action: CollectionActions<ManageViewContestHandoversCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'manageViewContestHandovers') {
        const { result, ref, order } = action.payload;
        const context = {
          role: getQueryParamValue(ref.query, 'role')[0],
          ...result,
        };
        return mergeDocuments<ManageViewContestHandoversCollection>(
          state,
          transformIntoDocuments(
            result.handovers,
            transformManageViewContestHandover,
            context,
          ),
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
