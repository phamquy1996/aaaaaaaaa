import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSkillsSubNavigation } from './skills-sub-navigation.transformer';
import { SkillsSubNavigationCollection } from './skills-sub-navigation.types';

export function skillsSubNavigationReducer(
  state: CollectionStateSlice<SkillsSubNavigationCollection> = {},
  action: CollectionActions<SkillsSubNavigationCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'skillsSubNavigation') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SkillsSubNavigationCollection>(
          state,
          transformIntoDocuments(result.subNavs, transformSkillsSubNavigation),
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
