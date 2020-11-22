import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformGroupMember } from './group-members.transformers';
import { GroupMembersCollection } from './group-members.types';

export function groupMembersReducer(
  state: CollectionStateSlice<GroupMembersCollection> = {},
  action: CollectionActions<GroupMembersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'groupMembers') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<GroupMembersCollection>(
          state,
          transformIntoDocuments(result.members, transformGroupMember),
          order,
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.type === 'resource') {
        const { data } = action.payload;
        if (
          data.payload.updateType === 'groupMember.remove' &&
          data.payload.payload.groupMember
        ) {
          const ref: Reference<GroupMembersCollection> = {
            path: {
              collection: 'groupsMembers',
              authUid: action.payload.toUserId,
            },
          };

          return removeDocumentById<GroupMembersCollection>(
            ref,
            state,
            data.payload.payload.groupMember.id,
          );
        }
      }
      return state;
    }

    default:
      return state;
  }
}
