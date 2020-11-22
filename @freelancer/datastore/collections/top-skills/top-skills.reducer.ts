import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTopSkills } from './top-skills.transformers';
import { TopSkillsCollection } from './top-skills.types';

export function topSkillsReducer(
  state: CollectionStateSlice<TopSkillsCollection> = {},
  action: CollectionActions<TopSkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'topSkills') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TopSkillsCollection>(
          state,
          transformIntoDocuments(result.topSkills, transformTopSkills),
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
