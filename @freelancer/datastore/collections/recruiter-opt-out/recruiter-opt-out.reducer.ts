import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { RecruiterOptOutCollection } from './recruiter-opt-out.types';

export function recruiterOptOutReducer(
  state: CollectionStateSlice<RecruiterOptOutCollection> = {},
  action: CollectionActions<RecruiterOptOutCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'recruiterOptOut') {
        const { document, ref } = action.payload;
        return mergeWebsocketDocuments<RecruiterOptOutCollection>(
          state,
          transformIntoDocuments([document], doc => doc),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
