import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectInvite } from './project-invite.transformers';
import { ProjectInviteCollection } from './project-invite.types';

export function projectInviteReducer(
  state: CollectionStateSlice<ProjectInviteCollection> = {},
  action: CollectionActions<ProjectInviteCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'projectInvite') {
        const { result, ref } = action.payload;
        return mergeWebsocketDocuments<ProjectInviteCollection>(
          state,
          transformIntoDocuments([result], transformProjectInvite),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
