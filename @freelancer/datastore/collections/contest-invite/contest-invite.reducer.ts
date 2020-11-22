import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestInvite } from './contest-invite.transformers';
import { ContestInviteCollection } from './contest-invite.types';

export function contestInviteReducer(
  state: CollectionStateSlice<ContestInviteCollection> = {},
  action: CollectionActions<ContestInviteCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestInvite') {
        const { document, ref } = action.payload;
        return mergeWebsocketDocuments<ContestInviteCollection>(
          state,
          transformIntoDocuments([document], contestInvite =>
            transformContestInvite({
              ...contestInvite,
              id: Date.now(), // The Id here doesn't matter as this is a push-only collection
            }),
          ),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
