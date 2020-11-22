import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSkill } from './skills.transformers';
import { SkillsCollection } from './skills.types';

export function skillsReducer(
  state: CollectionStateSlice<SkillsCollection> = {},
  action: CollectionActions<SkillsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'skills') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SkillsCollection>(
          state,
          transformIntoDocuments(result, transformSkill),
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
