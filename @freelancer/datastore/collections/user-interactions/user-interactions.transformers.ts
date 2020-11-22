import { UserInteractionApi } from './user-interactions.backend-model';
import { UserInteraction } from './user-interactions.model';

export function transformUserInteraction(
  userInteraction: UserInteractionApi,
): UserInteraction {
  return {
    id: userInteraction.id,
    eventId: userInteraction.eventId ?? undefined,
    eventName: userInteraction.eventName,
    otherUserId: userInteraction.otherUserId ?? undefined,
  };
}
