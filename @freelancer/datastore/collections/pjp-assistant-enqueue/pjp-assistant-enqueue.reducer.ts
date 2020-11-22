import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
} from '@freelancer/datastore/core';
import { PjpAssistantEnqueueCollection } from './pjp-assistant-enqueue.types';

export function pjpAssistantEnqueueReducer(
  state: CollectionStateSlice<PjpAssistantEnqueueCollection> = {},
  action: CollectionActions<PjpAssistantEnqueueCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'pjpAssistantEnqueue') {
        const { ref } = action.payload;
        return mergeWebsocketDocuments<PjpAssistantEnqueueCollection>(
          state,
          [],
          ref,
        );
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
