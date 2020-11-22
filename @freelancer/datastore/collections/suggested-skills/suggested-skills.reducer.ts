import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSuggestedSkills } from './suggested-skills.transformers';
import { SuggestedSkillsCollection } from './suggested-skills.types';

export function suggestedSkillsReducer(
  state: CollectionStateSlice<SuggestedSkillsCollection> = {},
  action: CollectionActions<SuggestedSkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'suggestedSkills') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SuggestedSkillsCollection>(
          state,
          transformIntoDocuments(result, transformSuggestedSkills),
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
