import {
  BidsCollection,
  CartItemsCollection,
  CartsCollection,
  ContestComment,
  ContestCommentsCollection,
  ContestCommentType,
  ContestsCollection,
  countries,
  CountryCode,
  Education,
  EducationsCollection,
  Experience,
  ExperiencesCollection,
  MessagesCollection,
  MilestoneDraftsCollection,
  MilestoneRequestsCollection,
  OnBehalfProjectsCollection,
  OnlineOfflineCollection,
  ParentContestComment,
  ProjectCollaboration,
  ProjectCollaborationsCollection,
  ProjectViewBidsCollection,
  ProjectViewProjectsCollection,
  ReplyContestComment,
  Review,
  ReviewsCollection,
  ThreadsCollection,
  TimeTrackingSessionCollection,
  universities,
  UserInteractionsCollection,
  UserNpsCollection,
  UserSkillsCollection,
  UserTypeInfoCollection,
} from '@freelancer/datastore/collections';
import { PushDocumentType } from '@freelancer/datastore/core';
import { generateId } from '@freelancer/datastore/testing';
import { PartialBy } from '@freelancer/types';
import { toNumber } from '@freelancer/utils';
import { ContestStatusApi } from 'api-typings/contests/contests';
import {
  ProjectCollaborationStatusApi,
  ProjectStatusApi,
} from 'api-typings/projects/projects';
import { addPushTransformer } from './document-creators';

export function addPushTransformers(authUid: number) {
  addPushTransformer<BidsCollection>('bids', addGeneratedNumericalId);
  addPushTransformer<CartItemsCollection>('cartItems', addGeneratedNumericalId);
  addPushTransformer<CartsCollection>('carts', addGeneratedNumericalId);
  addPushTransformer<ContestsCollection>('contests', addContestComputedFields);
  addPushTransformer<ContestCommentsCollection>(
    'contestComments',
    addContestCommentComputedFields,
  );
  addPushTransformer<EducationsCollection>(
    'educations',
    addEducationComputedFields,
  );
  addPushTransformer<ExperiencesCollection>(
    'experiences',
    addExperienceComputedFields,
  );
  addPushTransformer<MessagesCollection>('messages', addGeneratedNumericalId);
  addPushTransformer<MilestoneDraftsCollection>(
    'milestoneDrafts',
    addGeneratedNumericalId,
  );
  addPushTransformer<MilestoneRequestsCollection>(
    'milestoneRequests',
    addGeneratedNumericalId,
  );
  addPushTransformer<OnBehalfProjectsCollection>(
    'onBehalfProjects',
    addGeneratedNumericalId,
  );
  addPushTransformer<ProjectViewBidsCollection>(
    'projectViewBids',
    addGeneratedNumericalId,
  );
  addPushTransformer<ProjectViewProjectsCollection>(
    'projectViewProjects',
    addProjectViewProjectComputedFields,
  );
  addPushTransformer<ReviewsCollection>('reviews', addGeneratedStringId);
  addPushTransformer<ThreadsCollection>('threads', addGeneratedNumericalId);
  addPushTransformer<TimeTrackingSessionCollection>(
    'timeTrackingSession',
    addGeneratedNumericalId,
  );
  addPushTransformer<UserInteractionsCollection>(
    'userInteractions',
    addGeneratedNumericalId,
  );
  addPushTransformer<UserNpsCollection>('userNps', addGeneratedNumericalId);
  addPushTransformer<UserSkillsCollection>(
    'userSkills',
    addGeneratedNumericalId,
  );
  addPushTransformer<UserTypeInfoCollection>(
    'userTypeInfo',
    addGeneratedNumericalId,
  );
  // the onlineOffline "id" is a user id which should be provided
  addPushTransformer<OnlineOfflineCollection>('onlineOffline', noop);
}

export function noop<T extends { readonly id: number }>(
  authUid: number,
  document: T,
): T {
  return document;
}

export function addContestComputedFields(
  authUid: number,
  document: PushDocumentType<ContestsCollection> &
    Partial<Pick<ContestsCollection['DocumentType'], 'id'>>,
) {
  const id = toNumber(document.id) ?? generateId();

  return {
    ...document,
    id,
    seoUrl: `contest/${id}`,
    status: ContestStatusApi.ACTIVE,
  };
}

export function addGeneratedNumericalId<T extends { readonly id: number }>(
  authUid: number,
  document: PartialBy<T, 'id'>,
): T {
  return { ...document, id: toNumber(document.id) ?? generateId() } as any;
}

export function addGeneratedStringId<T extends { readonly id: string }>(
  authUid: number,
  document: PartialBy<T, 'id'>,
): T {
  return {
    ...document,
    id: document.id ? document.id.toString() : generateId().toString(),
  } as any;
}

export function addProjectViewProjectComputedFields(
  authUid: number,
  document: PushDocumentType<ProjectViewProjectsCollection> &
    Partial<Pick<ProjectViewProjectsCollection['DocumentType'], 'id'>>,
) {
  const id = toNumber(document.id) ?? generateId();

  return {
    ...document,
    id,
    attachments: [],
    bidStats: { bidCount: 0 },
    location: {},
    deleted: false,
    hideBids: false,
    ownerId: authUid,
    previewDescription: '',
    projectCollaborations: [],
    qualifications: [],
    seoUrl: `project-${id}`,
    status: ProjectStatusApi.ACTIVE,
    timeSubmitted: Date.now(),
    selectedBids: [],
    canPostReview: {},
    isEscrowProject: false,
    isSellerKycRequired: false,
    isBuyerKycRequired: false,
    isDeloitteProject: true,
    isTokenProject: true,

    hireme: document.hireme ?? false,
    local: document.local ?? false,
    language: document.language ?? 'en',
    ndaDetails: document.ndaDetails ?? { signatures: [] },
  };
}

export function addProjectCollaborationComputedFields(
  authUid: number,
  document: PushDocumentType<ProjectCollaborationsCollection>,
  collaboratorId: number,
): ProjectCollaboration {
  return {
    ...document,
    id: generateId(),
    userId: collaboratorId,
    contextOwnerId: authUid,
    timeCreated: Date.now() * 1000,
    status: ProjectCollaborationStatusApi.ACTIVE,
  };
}

export function addExperienceComputedFields(
  authUid: number,
  document: PushDocumentType<ExperiencesCollection>,
): Experience {
  return { ...document, id: generateId(), userId: authUid, ordering: 1 };
}

export function addEducationComputedFields(
  authUid: number,
  document: PushDocumentType<EducationsCollection>,
): Education {
  const { countryCode, schoolId, startDate, endDate } = document;
  return {
    ...document,
    id: generateId(),
    schoolName:
      countryCode && schoolId
        ? universities[countryCode as CountryCode]?.find(
            uni => uni.id === schoolId,
          )?.name
        : undefined,
    country: countryCode
      ? countries[countryCode as CountryCode].name
      : undefined,
    ordering: 1,
    duration: startDate && endDate ? endDate - startDate : undefined,
  };
}
// Only use this if your test assumes the other party has already left a review.
// It causes Freelancer/EmployerReviewAreaComponent#reviewGiven$ to emit after a review is submitted.
export function addReviewComputedFields(
  authUid: number,
  document: PushDocumentType<ReviewsCollection> &
    Partial<Pick<ReviewsCollection['DocumentType'], 'id'>>,
): Review {
  return {
    ...document,
    id: document.id ? document.id.toString() : generateId().toString(),
    // This is the review context.seoUrl, which differs from the project.seoUrl
    // Matches the reviews datastore call, see FreelancerReviewArea#reviewContext$
    context: {
      ...document.context,
      seoUrl: `/projects/${document.context.seoUrl}/`,
    },
  } as Review;
}

export function addContestCommentComputedFields(
  authUid: number,
  document: PushDocumentType<ContestCommentsCollection>,
): ContestComment {
  if (document.parentId) {
    return {
      ...document,
      id: generateId(),
      type: ContestCommentType.PARENT,
      parentId: undefined,
      repliesCount: 0,
      timestamp: Date.now(),
      dateLastComment: Date.now(),
    } as ParentContestComment;
  }

  return {
    ...document,
    id: generateId(),
    timestamp: Date.now(),
    dateLastComment: Date.now(),
    type: ContestCommentType.REPLY,
  } as ReplyContestComment;
}
