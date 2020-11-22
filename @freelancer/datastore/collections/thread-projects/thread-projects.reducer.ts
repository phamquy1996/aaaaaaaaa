import {
  CollectionActions,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { ThreadsCollection } from '../threads/threads.types';
import { transformThreadProject } from './thread-projects.transformer';
import { ThreadProjectsCollection } from './thread-projects.types';

export function threadProjectsReducer(
  state = {},
  action:
    | CollectionActions<ThreadProjectsCollection>
    | CollectionActions<ThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'threadProjects') {
        const { result, ref, order } = action.payload;
        if (result.projects) {
          return mergeDocuments<ThreadProjectsCollection>(
            state,
            transformIntoDocuments(result.projects, transformThreadProject),
            order,
            ref,
          );
        }
        return state;
      }
      if (action.payload.type === 'threads') {
        const contextDetails = action.payload.result.context_details;
        if (!contextDetails || !contextDetails.projects) {
          return state;
        }

        const { ref } = action.payload;

        return mergeWebsocketDocuments<ThreadProjectsCollection>(
          state,
          transformIntoDocuments(
            contextDetails.projects,
            transformThreadProject,
          ),
          { path: { collection: 'threadProjects', authUid: ref.path.authUid } },
        );
      }

      return state;
    }

    default:
      return state;
  }
}
