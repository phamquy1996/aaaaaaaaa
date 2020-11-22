import { BaseThreadApi } from 'api-typings/messages/messages_types';
import { transformContext } from '../threads/threads.transformers';
import { SuperuserThread } from './superuser-threads.model';

export function transformSuperuserThread(
  superuserThread: BaseThreadApi,
  userId: string,
): SuperuserThread {
  const baseThread = superuserThread;

  if (!baseThread.id) {
    throw new Error('Threads should have an id');
  }
  if (!baseThread.owner) {
    throw new Error('Threads should have an owner');
  }

  return {
    context: transformContext(baseThread.context),
    id: baseThread.id,
    inactiveMembers: baseThread.inactive_members || [],
    members: baseThread.members || [],
    owner: baseThread.owner,
    timeCreated: (baseThread.time_created || 0) * 1000,
  };
}
