import { RoleApi } from 'api-typings/common/common';
import {
  ReviewProjectStatusApi,
  ReviewTypeApi,
} from 'api-typings/projects/projects';
import { Contest } from '../contests/contests.model';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { Project } from '../projects/projects.model';
import { Skill } from '../skills/skills.model';
import { phpSkill } from '../skills/skills.seed';
import {
  BaseReview,
  ContestReview,
  ProjectReviewForEmployer,
  ProjectReviewForFreelancer,
  RatingDetailsFromEmployerToFreelancer,
  RatingDetailsFromFreelancerToEmployer,
  Review,
} from './reviews.model';

export interface GenerateReviewOptions {
  readonly contextId: number;
  readonly contextName: string;
  readonly contextSeoUrl: string;
  readonly ratingDetails?:
    | RatingDetailsFromFreelancerToEmployer
    | RatingDetailsFromEmployerToFreelancer;
  readonly rating: number;
  readonly reviewType: ReviewTypeApi;
  readonly fromUserId: number;
  readonly toUserId: number;
  readonly bidAmount?: number;
  readonly paidAmount?: number;
  readonly currencyCode?: CurrencyCode;
  readonly description?: string;
  readonly featured?: boolean;
  readonly projectStatus?: ReviewProjectStatusApi;
  readonly sealed?: boolean;
  readonly backendId?: number;
  readonly skills?: ReadonlyArray<Skill>;
  readonly skillIds?: ReadonlyArray<number>;
  readonly role?: RoleApi;
}

export function generateReviewObject({
  contextId,
  contextName,
  contextSeoUrl,
  ratingDetails,
  reviewType,
  fromUserId,
  toUserId,
  rating = 5,
  bidAmount = 250, // TODO: incorporate this into a mixin so it has no default
  paidAmount = bidAmount, // by default, the bid is paid (milestone released)
  currencyCode = CurrencyCode.USD,
  description = 'This is a review.',
  featured = false,
  sealed = false,
  projectStatus,
  backendId,
  skills = [phpSkill()],
  skillIds = [phpSkill().id],
  role = RoleApi.FREELANCER,
}: GenerateReviewOptions): Review {
  const baseReview: BaseReview = {
    id: `${reviewType}-${contextId}-${fromUserId}-${toUserId}`,
    reviewType,
    fromUserId,
    toUserId,
    rating,
    bidAmount,
    paidAmount,
    currency: generateCurrencyObject(currencyCode),
    description,
    featured,
    sealed,
    projectStatus, // TODO: Investigate this further for accurate seeds
    backendId,
    skills,
    skillIds,
    timeSubmitted: Date.now(),
  };

  return reviewType === ReviewTypeApi.PROJECT
    ? ({
        ...baseReview,
        context: {
          id: contextId,
          name: contextName,
          seoUrl: contextSeoUrl,
          type: reviewType,
        },
        ratingDetails,
        role, // whether the review was for a freelancer or employer
      } as ProjectReviewForEmployer | ProjectReviewForFreelancer)
    : ({
        ...baseReview,
        context: {
          id: contextId,
          name: contextName,
          seoUrl: contextSeoUrl,
          type: reviewType,
        },
        role,
      } as ContestReview);
}

// --- Mixins ---

export function forProject(
  project: Project,
): Pick<
  GenerateReviewOptions,
  'contextId' | 'contextName' | 'contextSeoUrl' | 'reviewType'
> {
  return {
    contextId: project.id,
    contextName: project.title,
    contextSeoUrl: `/projects/${project.seoUrl}/`,
    reviewType: ReviewTypeApi.PROJECT,
  };
}

export function forContest(
  contest: Contest,
): Pick<
  GenerateReviewOptions,
  'contextId' | 'contextName' | 'contextSeoUrl' | 'reviewType' | 'bidAmount'
> {
  return {
    contextId: contest.id,
    contextName: contest.title,
    contextSeoUrl: contest.seoUrl,
    reviewType: ReviewTypeApi.CONTEST,
    bidAmount: contest.prize,
  };
}

/* Defaults to 5 star rating across all categories */
export function toFreelancer(
  freelancerUserId: number,
  rating = 5,
  onBudget = true,
  onTime = true,
): Pick<
  GenerateReviewOptions,
  'toUserId' | 'role' | 'rating' | 'ratingDetails'
> {
  if (rating < 0 || rating > 5) {
    throw new Error('Rating must be between 0 and 5 inclusive');
  }

  return {
    toUserId: freelancerUserId,
    role: RoleApi.FREELANCER,
    rating,
    ratingDetails: {
      communication: rating,
      expertise: rating,
      hireAgain: rating,
      professionalism: rating,
      quality: rating,

      onBudget, // "YES" / "NO" / "x%" (percentage for hourly projects)
      onTime, // "YES" / "NO" / "x%" (percentage for hourly projects)
    },
  };
}

/* Defaults to 5 star rating across all categories */
export function toEmployer(
  employerUserId: number,
  rating = 5,
): Pick<
  GenerateReviewOptions,
  'toUserId' | 'role' | 'rating' | 'ratingDetails'
> {
  return {
    toUserId: employerUserId,
    role: RoleApi.EMPLOYER,
    rating,
    ratingDetails: {
      claritySpec: rating,
      communication: rating,
      paymentPrompt: rating,
      professionalism: rating,
      workForAgain: rating,
    },
  };
}
