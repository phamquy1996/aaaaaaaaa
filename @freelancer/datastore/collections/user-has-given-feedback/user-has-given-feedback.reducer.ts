import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import { ReviewsCollection } from '../reviews/reviews.types';
import { UserReviewRole } from './user-has-given-feedback.backend-model';
import { transformUserHasGivenFeedback } from './user-has-given-feedback.transformers';
import { UserHasGivenFeedbackCollection } from './user-has-given-feedback.types';

export function userHasGivenFeedbackReducer(
  state: CollectionStateSlice<UserHasGivenFeedbackCollection> = {},
  action:
    | CollectionActions<UserHasGivenFeedbackCollection>
    | CollectionActions<ReviewsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userHasGivenFeedback') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<UserHasGivenFeedbackCollection>(
          state,
          transformIntoDocuments(result, transformUserHasGivenFeedback),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      // Update userHasGivenFeedback.feedBackLeft to true when review posted success
      if (action.payload.type === 'reviews') {
        const { rawRequest } = action.payload;
        const ref: Reference<UserHasGivenFeedbackCollection> = {
          path: {
            collection: 'userHasGivenFeedback',
            authUid: action.payload.ref.path.authUid,
          },
        };
        return updateWebsocketDocuments<UserHasGivenFeedbackCollection>(
          state,
          [`${rawRequest.project_id}-${rawRequest.to_user_id}`],
          userHasGivenFeedback => ({
            id: `${rawRequest.project_id}-${rawRequest.to_user_id}`,
            feedbackLeft: true,
            projectId: rawRequest.project_id,
            toUserId: rawRequest.to_user_id,
            fromUserId: rawRequest.from_user_id,
            reviewType:
              rawRequest.role === RoleApi.FREELANCER
                ? UserReviewRole.SELLER
                : UserReviewRole.BUYER,
          }),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
