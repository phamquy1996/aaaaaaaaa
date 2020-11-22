import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSkillBundle } from './skill-bundles.transformers';
import { SkillBundlesCollection } from './skill-bundles.types';

export function skillBundlesReducer(
  state: CollectionStateSlice<SkillBundlesCollection> = {},
  action: CollectionActions<SkillBundlesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'skillBundles') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SkillBundlesCollection>(
          state,
          transformIntoDocuments(result.job_bundles, transformSkillBundle),
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
