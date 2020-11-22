import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { isDefined, toNumber } from '@freelancer/utils';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { ThreadUpdateActionRawPayload } from './threads.backend-model';
import { Thread } from './threads.model';
import { ThreadsCollection } from './threads.types';

// IMPORTANT: When fetching threads, we passed in `context_details: true`
// param, aside from fetching the threads this will also fetch a document
// which can be a project or contest depending on the context type
// and since thread-projects.reducer.ts listens on both threads and threadsProject
// collections, we need to make sure that both collections returns the same fields
// of the same object for consistency and to avoid any potential bug, so any projection
// added on threadProjects collection must also reflect here (vice versa).

export function threadsBackend(): Backend<ThreadsCollection> {
  return {
    defaultOrder: {
      field: 'timeUpdated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `messages/0.1/threads`,
      params: {
        threads: ids,
        members: getQueryParamValue(query, 'otherMembers')[0],
        context_type: getThreadContextTypeQueryParamValue(query),
        contexts: getThreadContextIdsQueryParamValue(query),
        thread_types: getQueryParamValue(query, 'threadType'),
        is_read: getQueryParamValue(query, 'isRead')[0],
        folders: getQueryParamValue(query, 'folder'),
        unread_count: 'true',
        last_message: 'true',
        context_details: 'true',
        user_read_times: 'true',
      },
    }),
    push: (_, thread) => ({
      endpoint: `messages/0.1/threads/`,
      asFormData: true,
      payload: {
        context:
          thread.context.type !== ContextTypeApi.NONE
            ? thread.context.id
            : undefined,
        context_type: thread.context.type,
        thread_type: thread.threadType,
        members: thread.members,
        message: (thread.message && thread.message.message) || '',
        source: 21,
      },
    }),
    set: undefined,
    update: (authUid, thread, originalThread) => {
      let payload: ThreadUpdateActionRawPayload | undefined;
      let endpoint: string | undefined;
      let method: 'PUT' | 'POST' = 'PUT';
      const asFormData = true;

      if (thread.isRead === true) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }
        payload = {
          threads: [toNumber(originalThread.id)],
          action: 'read',
        };
        endpoint = `messages/0.1/threads/`;
      }

      if (thread.isMuted !== undefined) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }
        payload = {
          threads: [toNumber(originalThread.id)],
          action: thread.isMuted ? 'mute' : 'unmute',
        };
        endpoint = `messages/0.1/threads/`;
      }

      if (thread.isBlocked !== undefined) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }
        payload = {
          threads: [toNumber(originalThread.id)],
          action: thread.isBlocked ? 'block' : 'unblock',
        };
        endpoint = `messages/0.1/threads/`;
      }

      if (thread.folder) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }

        if (thread.folder === 'inbox') {
          payload = {
            threads: [toNumber(originalThread.id)],
            action: 'unarchive',
          };
        } else if (thread.folder === 'archived') {
          payload = {
            threads: [toNumber(originalThread.id)],
            action: 'archive',
          };
        } else {
          throw new Error(`Cannot push for threads`);
        }
        endpoint = `messages/0.1/threads/`;
      }

      if (
        thread.members &&
        thread.members.length !== originalThread.members.length
      ) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }
        endpoint = `messages/0.1/threads/${originalThread.id}/members/`;
        if (thread.members.length > originalThread.members.length) {
          payload = {
            thread_id: originalThread.id,
            action: 'add',
            members: thread.members
              .filter(isDefined)
              .filter(member => !originalThread.members.includes(member)),
          };
        } else if (thread.members.length < originalThread.members.length) {
          payload = {
            thread_id: originalThread.id,
            action: 'remove',
            members: originalThread.members.filter(
              members => !(thread.members || []).includes(members),
            ),
          };
        }
      }

      if (thread.typing) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }
        payload = { thread_id: originalThread.id };
        endpoint = `messages/0.1/threads/${originalThread.id}/typing/`;
        method = 'POST';
      }
      if (payload === undefined || endpoint === undefined) {
        throw new Error(`Cound not update any fields of`);
      }
      return { asFormData, payload, endpoint, method };
    },
    remove: undefined,
  };
}
function getThreadContextTypeQueryParamValue(
  query?: RawQuery<Thread>,
): ContextTypeApi | undefined {
  return getQueryParamValue(query, 'context')
    ? getQueryParamValue(query, 'context', param =>
        param.condition === '==' ? param.value.type : undefined,
      )[0]
    : getQueryParamValue(query, 'contextType')[0];
}

function getThreadContextIdsQueryParamValue(
  query?: RawQuery<Thread>,
): ReadonlyArray<number> {
  return getQueryParamValue(query, 'context', param =>
    param.condition === '==' && param.value.type !== ContextTypeApi.NONE
      ? param.value.id
      : undefined,
  ).filter(isDefined);
}
