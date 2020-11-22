import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  Path,
  removeDocumentById,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { Task } from './tasks.model';
import { transformTasks } from './tasks.transformers';
import { TasksCollection } from './tasks.types';

export function tasksReducer(
  state: CollectionStateSlice<TasksCollection> = {},
  action: CollectionActions<TasksCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'tasks') {
        const { result, ref, order } = action.payload;

        if (result.tasks) {
          return mergeDocuments<TasksCollection>(
            state,
            transformIntoDocuments(result.tasks, transformTasks),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    case 'API_PUSH': {
      if (action.payload.type === 'tasks') {
        const { document: object, ref } = action.payload;

        return mergeWebsocketDocuments<TasksCollection>(
          state,
          transformIntoDocuments([object], (t: Task) => t),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE': {
      if (action.payload.type === 'tasks') {
        const { delta, ref, originalDocument } = action.payload;

        return mergeWebsocketDocuments<TasksCollection>(
          state,
          transformIntoDocuments(
            [deepSpread(originalDocument, delta)],
            (t: Task) => t,
          ),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_ERROR': {
      if (action.payload.type === 'tasks') {
        const { document: object, ref } = action.payload;

        return removeDocumentById<TasksCollection>(ref, state, object.id);
      }
      return state;
    }

    case 'API_UPDATE_ERROR': {
      if (action.payload.type === 'tasks') {
        const { originalDocument, ref } = action.payload;

        return mergeWebsocketDocuments<TasksCollection>(
          state,
          transformIntoDocuments([originalDocument], (t: Task) => t),
          ref,
        );
      }
      return state;
    }

    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'tasks') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<TasksCollection>(
          removeDocumentById<TasksCollection>(
            ref,
            state,
            action.payload.document.id,
          ),
          transformIntoDocuments([result.task], transformTasks),
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'tasks') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<TasksCollection>(
          state,
          transformIntoDocuments([result.task], transformTasks),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      const { payload } = action;
      if (
        payload.parent_type === 'notifications' &&
        (payload.type === 'tasklistCreateV1' ||
          payload.type === 'tasklistUpdateV1')
      ) {
        const userId = payload.toUserId;
        const path: Path<TasksCollection> = {
          collection: 'tasks',
          authUid: userId,
        };
        const ref = { path };
        const task = payload.data;
        return mergeWebsocketDocuments<TasksCollection>(
          state,
          transformIntoDocuments([task], transformTasks),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
