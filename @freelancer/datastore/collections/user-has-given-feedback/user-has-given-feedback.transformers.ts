import { UserHasGivenFeedbackAjax } from './user-has-given-feedback.backend-model';
import { UserHasGivenFeedback } from './user-has-given-feedback.model';

export function transformUserHasGivenFeedback(
  userHasGivenFeedback: UserHasGivenFeedbackAjax,
): UserHasGivenFeedback {
  return {
    id: `${userHasGivenFeedback.projectId}-${userHasGivenFeedback.toUserId}`,
    feedbackLeft: userHasGivenFeedback.feedbackLeft,
    fromUserId: userHasGivenFeedback.fromUserId,
    toUserId: userHasGivenFeedback.toUserId,
    projectId: userHasGivenFeedback.projectId,
    reviewType: userHasGivenFeedback.reviewType,
  };
}
