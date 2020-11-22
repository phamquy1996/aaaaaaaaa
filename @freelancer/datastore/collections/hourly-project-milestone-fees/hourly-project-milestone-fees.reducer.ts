import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformHourlyProjectMilestoneFee } from './hourly-project-milestone-fees.transformer';
import { HourlyProjectMilestoneFeesCollection } from './hourly-project-milestone-fees.types';

export function hourlyProjectMilestoneFeesReducer(
  state: CollectionStateSlice<HourlyProjectMilestoneFeesCollection> = {},
  action: CollectionActions<HourlyProjectMilestoneFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'hourlyProjectMilestoneFees') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<HourlyProjectMilestoneFeesCollection>(
          state,
          transformIntoDocuments([result], transformHourlyProjectMilestoneFee),
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
