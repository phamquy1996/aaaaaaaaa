import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPredictedSkills } from './predicted-skills.transformers';
import { PredictedSkillsCollection } from './predicted-skills.types';

export function predictedSkillsReducer(
  state: CollectionStateSlice<PredictedSkillsCollection> = {},
  action: CollectionActions<PredictedSkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'predictedSkills') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<PredictedSkillsCollection>(
          state,
          transformIntoDocuments(result, transformPredictedSkills),
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
