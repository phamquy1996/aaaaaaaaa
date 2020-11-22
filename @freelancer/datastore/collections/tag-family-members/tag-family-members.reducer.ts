import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTagFamilyMember } from './tag-family-members.transformers';
import { TagFamilyMembersCollection } from './tag-family-members.types';

export function tagFamilyMembersReducer(
  state: CollectionStateSlice<TagFamilyMembersCollection> = {},
  action: CollectionActions<TagFamilyMembersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tagFamilyMembers') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<TagFamilyMembersCollection>(
          state,
          transformIntoDocuments(result, transformTagFamilyMember),
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
