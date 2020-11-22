export type UserHasGivenFeedbackResultAjax = ReadonlyArray<
  UserHasGivenFeedbackAjax
>;

export enum UserReviewRole {
  SELLER = 'seller', // Use this for querying employer to freelancer review
  BUYER = 'buyer', // Use this for fromUserId = freelancer, toUserId=Employer
}

export interface UserHasGivenFeedbackAjax {
  readonly feedbackLeft: boolean;
  readonly projectId: number;
  readonly toUserId: number;
  readonly fromUserId: number;
  readonly reviewType: UserReviewRole;
}
