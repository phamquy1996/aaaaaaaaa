import { RoleApi } from 'api-typings/common/common';
import { ContestApi } from 'api-typings/contests/contests';
import {
  OverallRatingDetailsApi,
  ProjectApi,
  ReviewApi,
  ReviewContextApi,
  ReviewsGetResultApi,
  ReviewTypeApi,
} from 'api-typings/projects/projects';
import { transformCurrency } from '../currencies/currencies.transformers';
import { Skill } from '../skills/skills.model';
import { transformSkill } from '../skills/skills.transformers';
import {
  BaseReview,
  RatingDetailsFromEmployerToFreelancer,
  RatingDetailsFromFreelancerToEmployer,
  Review,
  ReviewContext,
} from './reviews.model';

export function transformReviews(
  review: ReviewApi,
  getResult: ReviewsGetResultApi,
): Review {
  const contextItem = getReviewContextItem(review, getResult);

  const baseReview: BaseReview = {
    bidAmount: review.bid_amount || 0,
    currency: transformCurrency(review.currency),
    description: review.description || '',
    featured: review.featured || false,
    fromUserId: review.from_user_id,
    id: constructDatastoreReviewId(
      review.review_context.review_type,
      review.review_context.context_id,
      review.from_user_id,
      review.to_user_id,
    ),
    paidAmount: review.paid_amount || 0,
    projectStatus: review.review_project_status,
    rating: review.rating || 0,
    sealed: review.sealed || false,
    timeSubmitted: review.time_submitted ? review.time_submitted * 1000 : 0,
    toUserId: review.to_user_id,
    backendId: review.id,
    skillIds: contextItem
      ? transformProjectReviewSkillIds(review, contextItem)
      : [],
    skills: contextItem ? transformProjectReviewJobs(review, contextItem) : [],
    reviewType: review.review_context.review_type,
  };

  if (isProjectContext(review.review_context)) {
    return review.role === RoleApi.EMPLOYER
      ? {
          ...baseReview,
          context: transformReviewContext(review.review_context),
          role: review.role,
          ratingDetails: review.rating_details
            ? transformEmployerRatingDetails(review.rating_details)
            : undefined,
        }
      : {
          ...baseReview,
          context: transformReviewContext(review.review_context),
          role: review.role,
          ratingDetails: review.rating_details
            ? transformFreelancerRatingDetails(review.rating_details)
            : undefined,
        };
  }

  if (isContestContext(review.review_context)) {
    return {
      ...baseReview,
      context: transformReviewContext(review.review_context),
      role: review.role,
    };
  }

  throw Error('Reviews need to be for a project or a contest');
}

function transformProjectReviewSkillIds(
  review: ReviewApi,
  project: ProjectApi | ContestApi,
): ReadonlyArray<number> {
  if (project === undefined) {
    return [];
  }

  if (project.jobs) {
    return project.jobs.map(skill => skill.id);
  }

  return [];
}

function transformProjectReviewJobs(
  review: ReviewApi,
  project?: ProjectApi | ContestApi,
): ReadonlyArray<Skill> {
  if (project === undefined) {
    return [];
  }

  if (project.jobs) {
    return project.jobs.map(job => transformSkill(job));
  }

  return [];
}

function isProjectContext(
  context: ReviewContextApi,
): context is ReviewContextApi & {
  readonly review_type: ReviewTypeApi.PROJECT;
} {
  return context.review_type === ReviewTypeApi.PROJECT;
}

function isContestContext(
  context: ReviewContextApi,
): context is ReviewContextApi & {
  readonly review_type: ReviewTypeApi.CONTEST;
} {
  return context.review_type === ReviewTypeApi.CONTEST;
}

export function transformReviewContext<T extends ReviewTypeApi>(
  context: ReviewContextApi & { readonly review_type: T },
): ReviewContext<T> {
  // Sample review API returned seoUrl: "projects/data-entry/emp-perm-18299310/"
  // Sample project API returned seoUrl: "data-entry/emp-perm-18299310"
  // Any changes on backend seoUrl may make review collection fail to merge in datastore
  // Any changes on this variable may make review collection fail to merge in datastore
  // Make sure this url matches all the review Collection GET query param !
  // becomes "/projects/seo/url" to make it easier to use router links

  const reviewType =
    context.review_type === ReviewTypeApi.PROJECT ? 'projects' : 'contests';
  const transformedSeoUrl = context.seo_url
    ? `/${reviewType}/${
        // add /projects/ or /contests/ at the head depending on the context type.
        context.seo_url
          .split('/')
          .filter(
            fragment =>
              fragment !== '' &&
              fragment !== 'projects' &&
              fragment !== 'contest',
          ) // Get rid of "" , "projects" and "contest"
          .join('/') // join with "/", result = "design/hi-123", same as project.seoUrl
      }${context.seo_url.endsWith('/') ? '/' : ''}` // If there was '/' at end, add it, otherwise omit it, to fit '.html' seoUrls
    : '';
  return {
    id: context.context_id,
    name: context.context_name || '',
    seoUrl: transformedSeoUrl,
    type: context.review_type,
  };
}

export function transformEmployerRatingDetails(
  ratingDetails: OverallRatingDetailsApi,
): RatingDetailsFromFreelancerToEmployer {
  if (!ratingDetails.category_ratings) {
    throw Error('Must have category ratings in project review for an employer');
  }

  return {
    claritySpec: ratingDetails.category_ratings.clarity_spec || 0,
    communication: ratingDetails.category_ratings.communication || 0,
    paymentPrompt: ratingDetails.category_ratings.payment_prompt || 0,
    professionalism: ratingDetails.category_ratings.professionalism || 0,
    workForAgain: ratingDetails.category_ratings.work_for_again || 0,
  };
}

export function transformFreelancerRatingDetails(
  ratingDetails: OverallRatingDetailsApi,
): RatingDetailsFromEmployerToFreelancer {
  if (!ratingDetails.category_ratings) {
    throw Error(
      'Must have category ratings in project review for a freelancer',
    );
  }

  return {
    quality: ratingDetails.category_ratings.quality || 0,
    communication: ratingDetails.category_ratings.communication || 0,
    expertise: ratingDetails.category_ratings.expertise || 0,
    professionalism: ratingDetails.category_ratings.professionalism || 0,
    hireAgain: ratingDetails.category_ratings.hire_again || 0,
    onBudget: transformOnBudgetOnTimeDisplay(ratingDetails.on_budget_display),
    // tslint:disable-next-line:validate-millisecond-timestamps
    onTime: transformOnBudgetOnTimeDisplay(ratingDetails.on_time_display),
  };
}

function transformOnBudgetOnTimeDisplay(
  onBudgetOnTimeDisplay: string = 'no',
): boolean | number {
  if (onBudgetOnTimeDisplay.toLowerCase() === 'no') {
    return false;
  }
  if (onBudgetOnTimeDisplay.toLowerCase() === 'yes') {
    return true;
  }

  // This will strip the "%" from the end (for hourly project reviews)
  return parseInt(onBudgetOnTimeDisplay, 10);
}

export function constructDatastoreReviewId(
  reviewType: ReviewTypeApi,
  contextId: number,
  fromUserId: number,
  toUserId: number,
) {
  return `${reviewType}-${contextId}-${fromUserId}-${toUserId}`;
}

function getReviewContextItem(
  review: ReviewApi,
  getResult: ReviewsGetResultApi,
): ProjectApi | ContestApi | undefined {
  switch (review.review_context.review_type) {
    case ReviewTypeApi.PROJECT:
      return getResult.projects
        ? getResult.projects[review.review_context.context_id]
        : undefined;
    case ReviewTypeApi.CONTEST:
      return getResult.contests
        ? getResult.contests[review.review_context.context_id]
        : undefined;
    default:
      return undefined;
  }
}
