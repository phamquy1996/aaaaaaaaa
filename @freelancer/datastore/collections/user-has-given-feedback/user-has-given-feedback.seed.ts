import { ProjectReviewForEmployer } from '../reviews/reviews.model';
import { UserReviewRole } from './user-has-given-feedback.backend-model';
import { UserHasGivenFeedback } from './user-has-given-feedback.model';

export interface GenerateUserHasGivenFeedbackOptions {
  readonly feedbackLeft: boolean;
  readonly projectId: number;
  readonly toUserId: number;
  readonly fromUserId: number;
  readonly reviewType: UserReviewRole;
}

export function generateUserHasGivenFeedbackObject({
  feedbackLeft,
  projectId,
  toUserId,
  fromUserId,
  reviewType,
}: GenerateUserHasGivenFeedbackOptions): UserHasGivenFeedback {
  return {
    id: `${projectId}-${toUserId}`,
    feedbackLeft,
    projectId,
    toUserId,
    fromUserId,
    reviewType,
  };
}

export function reviewFreelancerToEmployerHasGivenFeedbackTransformer(
  authUid: number,
  review: ProjectReviewForEmployer,
): UserHasGivenFeedback {
  return {
    id: `${review.context.id}-${review.toUserId}`,
    feedbackLeft: true,
    projectId: review.context.id,
    toUserId: review.toUserId,
    fromUserId: review.fromUserId,
    reviewType: UserReviewRole.BUYER,
  };
}
