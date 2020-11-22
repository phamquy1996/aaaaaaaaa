import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTimeTrackingPunches } from './time-tracking-punches.transformers';
import { TimeTrackingPunchesCollection } from './time-tracking-punches.types';

export function timeTrackingPunchesReducer(
  state: CollectionStateSlice<TimeTrackingPunchesCollection> = {},
  action: CollectionActions<TimeTrackingPunchesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'timeTrackingPunches') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TimeTrackingPunchesCollection>(
          state,
          transformIntoDocuments(result.punches, transformTimeTrackingPunches),
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
