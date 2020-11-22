import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformMilestone } from '../milestones/milestones.transformers';
import { SuperuserMilestonesCollection } from './superuser-milestones.types';

export function superuserMilestonesReducer(
  state = {},
  action: CollectionActions<SuperuserMilestonesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'superuserMilestones') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuperuserMilestonesCollection>(
          state,
          transformIntoDocuments(result.milestones, transformMilestone),
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
