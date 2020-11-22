import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { RoleApi } from 'api-typings/common/common';
import {
  ReviewActionTypeApi,
  ReviewTypeApi,
} from 'api-typings/projects/projects';
import {
  BaseReviewPostPayload,
  ProjectReviewEmployerToFreelancerPostPayload,
  ProjectReviewFreelancerToEmployerPostPayload,
} from './reviews.backend-model';
import {
  ProjectReviewForEmployer,
  ProjectReviewForFreelancer,
  Review,
} from './reviews.model';
import { ReviewsCollection } from './reviews.types';

export function reviewsBackend(): Backend<ReviewsCollection> {
  return {
    defaultOrder: {
      field: 'timeSubmitted',
      direction: OrderByDirection.DESC, // recent reviews first
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/0.1/reviews/',
      isGaf: false,
      params: {
        // role is the identity of the user that review given to, not given by
        role: getRoleQueryParamValue(query),
        to_users: getQueryParamValue(query, 'toUserId'),
        projects: getQueryParamValue(query, 'context').map(
          context => context.id,
        ),
        featured: getFeaturedQueryParamValue(query),
        job_ids: getQueryParamValue(query, 'skillIds')[0],
        project_details: 'true',
        contest_details: 'true',
        project_job_details: 'true',
        contest_job_details: 'true',
        review_types: getQueryParamValue(query, 'reviewType'),
      },
    }),
    push: (_, review) => {
      const endpoint = `projects/0.1/reviews/`;
      const asFormData = false;

      const basePayload: BaseReviewPostPayload = {
        project_id: review.context.id,
        to_user_id: review.toUserId,
        from_user_id: review.fromUserId,
        comment: review.description,
      };

      // For rating, API require average rating(sum/2.5) between 1-10
      // It is better to filter this in front-end, ask each between 0.5-5
      if (review.context.type === ReviewTypeApi.PROJECT) {
        if (review.role === RoleApi.FREELANCER) {
          const { ratingDetails } = review as ProjectReviewForFreelancer;
          if (!ratingDetails) {
            throw new Error(
              'Please construct rating details struct in front-end',
            );
          }

          const payload: ProjectReviewEmployerToFreelancerPostPayload = {
            ...basePayload,
            review_type: ReviewTypeApi.PROJECT,
            role: RoleApi.FREELANCER,
            reputation_data: {
              category_ratings: {
                communication: ratingDetails.communication,
                expertise: ratingDetails.expertise,
                hire_again: ratingDetails.hireAgain,
                professionalism: ratingDetails.professionalism,
                quality: ratingDetails.quality,
              },
              on_budget: ratingDetails.onBudget ? 1 : 0,
              on_time: ratingDetails.onTime ? 1 : 0,
            },
          };

          return {
            endpoint,
            asFormData,
            payload,
          };
        }
        if (review.role === RoleApi.EMPLOYER) {
          const { ratingDetails } = review as ProjectReviewForEmployer;
          if (!ratingDetails) {
            throw new Error(
              'Please construct rating details struct in front-end',
            );
          }
          const payload: ProjectReviewFreelancerToEmployerPostPayload = {
            ...basePayload,
            review_type: ReviewTypeApi.PROJECT,
            role: RoleApi.EMPLOYER,
            reputation_data: {
              category_ratings: {
                clarity_spec: ratingDetails.claritySpec,
                communication: ratingDetails.communication,
                payment_prom: ratingDetails.paymentPrompt,
                professionalism: ratingDetails.professionalism,
                work_for_again: ratingDetails.workForAgain,
              },
            },
          };

          return {
            endpoint,
            asFormData,
            payload,
          };
        }
      }

      // TODO: support contest review through API and datastore
      throw new Error('We are not supporting contest review posting yet');
    },
    set: undefined,
    update: (authUid, review, originalReview) => {
      // TO Fix: Need to return review ID with POST
      if (!originalReview.backendId) {
        throw new Error('Cannot update without actual review id');
      }
      const endpoint = `projects/0.1/reviews/${originalReview.backendId}`;
      const method: 'PUT' | 'POST' = 'PUT';
      const asFormData = false;
      const { featured } = review;

      if (featured === undefined || !review.context || !review.context.type) {
        throw new Error(
          'Cannot update without both desired feature state and review type.',
        );
      }

      if (featured && originalReview.featured) {
        throw new Error('Review already been featured');
      } else if (!featured && !originalReview.featured) {
        throw new Error('Review already been unfeatured');
      }

      const payload = {
        action: featured
          ? ReviewActionTypeApi.FEATURE
          : ReviewActionTypeApi.UNFEATURE,
        review_type: review.context.type,
      };

      return {
        asFormData,
        payload,
        endpoint,
        method,
      };
    },
    remove: undefined,
  };
}
function getRoleQueryParamValue(
  query: RawQuery<Review> | undefined,
): RoleApi | undefined {
  return getQueryParamValue(query, 'role', param => {
    // `role` param can only accept a single value
    if (param.condition !== '==' && param.condition !== 'equalsIgnoreCase') {
      throw new Error('Specify a role filter for the reviews');
    }

    return param.value;
  })[0];
}

function getFeaturedQueryParamValue(
  query?: RawQuery<Review>,
): boolean | undefined {
  return getQueryParamValue(query, 'featured', param =>
    param.condition === '==' && param.value !== undefined
      ? param.value
      : undefined,
  )[0];
}
