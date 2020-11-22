import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { Review } from './reviews.model';
import {
  constructDatastoreReviewId,
  transformReviews,
} from './reviews.transformers';
import { ReviewsCollection } from './reviews.types';

export function reviewsReducer(
  state: CollectionStateSlice<ReviewsCollection> = {},
  action: CollectionActions<ReviewsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'reviews') {
        const { result, ref, order } = action.payload;

        return mergeDocuments<ReviewsCollection>(
          state,
          transformIntoDocuments(result.reviews, transformReviews, result),
          order,
          ref,
        );
      }

      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'reviews') {
        const { document, ref } = action.payload;
        return mergeWebsocketDocuments<ReviewsCollection>(
          state,
          transformIntoDocuments(
            [document],
            review =>
              ({
                ...review,
                id: constructDatastoreReviewId(
                  review.context.type,
                  review.context.id,
                  review.fromUserId,
                  review.toUserId,
                ),
              } as Review), // Omit doesn't work great with union types
          ),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'reviews') {
        const {
          delta: payload,
          originalDocument: originalReview,
          ref,
        } = action.payload;
        return updateWebsocketDocuments<ReviewsCollection>(
          state,
          [originalReview.id],
          review => ({
            ...review,
            featured: payload.featured || false,
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
