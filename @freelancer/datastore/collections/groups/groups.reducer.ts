import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformGroup } from './groups.transformers';
import { GroupsCollection } from './groups.types';

export function groupsReducer(
  state: CollectionStateSlice<GroupsCollection> = {},
  action: CollectionActions<GroupsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'groups') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<GroupsCollection>(
          state,
          transformIntoDocuments(result.groups, transformGroup),
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
          data.payload.updateType === 'group.update' &&
          data.payload.payload.group
        ) {
          const ref: Reference<GroupsCollection> = {
            path: {
              collection: 'groups',
              authUid: action.payload.toUserId,
            },
          };

          return mergeWebsocketDocuments<GroupsCollection>(
            state,
            transformIntoDocuments(
              [data.payload.payload.group],
              transformGroup,
            ),
            ref,
          );
        }
      }
      return state;
    }

    default:
      return state;
  }
}
