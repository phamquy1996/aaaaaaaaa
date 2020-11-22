import { TimeMilliseconds } from '@freelancer/datastore/core';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import { TaskApi } from 'api-typings/tasklist/tasklist';
import { Currency } from '../currencies/currencies.model';

/**
 * A notification which is displayed on the dashboard newsfeed.
 *
 * These are received via the Websocket.
 */
export type NewsfeedEntry =
  | NotificationAcceptDisputeOffer
  | NotificationAccepted
  | NotificationActivateFreelancer
  | NotificationAdminForceVerifyPhone
  | NotificationArticleComment
  | NotificationAward
  | NotificationBid
  | NotificationCompleteContestReview
  | NotificationCompleteReview
  | NotificationContestAwardedToEmployer
  | NotificationContestAwardedToFreelancer
  | NotificationContestComplete
  | NotificationContestCreated
  | NotificationContestEntryCreated
  | NotificationContestEntryRated
  | NotificationContestExpired
  | NotificationContestPCB
  | NotificationContestReviewPosted
  | NotificationCreateMilestone
  | NotificationCustomAdminNotification
  | NotificationDenied
  | NotificationDirectTransferDone
  | NotificationDraftContest
  | NotificationEditAwardedBidAccepted
  | NotificationEmailChange
  | NotificationEscalateDispute
  | NotificationHireMe
  | NotificationInviteToContest
  | NotificationInviteUserBid
  | NotificationInvoiceFeedback
  | NotificationInvoicePaid
  | NotificationInvoiceRequestChange
  | NotificationInvoiceRequested
  | NotificationInvoiceWithdrawn
  | NotificationKYC
  | NotificationMakeDisputeOffer
  | NotificationNewDispute
  | NotificationPendingFunds
  | NotificationPostDraftProject
  | NotificationPostOnBehalfProject
  | NotificationPrizeDispersedEmployer
  | NotificationPrizeDispersedFreelancer
  | NotificationProjectCompleted
  | NotificationProjectEmailVerificationRequired
  | NotificationProjectHireMeExpired
  | NotificationProjectSharedWithYou
  | NotificationRejected
  | NotificationRejectOnBehalfProject
  | NotificationReleaseMilestone
  | NotificationReleasePartMilestone
  | NotificationRemindUseBids
  | NotificationRequestMilestone
  | NotificationRequestEndProject
  | NotificationRequestToRelease
  | NotificationReviewActivate
  | NotificationReviewPostedNew
  | NotificationRevoke
  | NotificationSendDisputeMessage
  | NotificationShowcaseSourceApproval
  | NotificationSubmitOnBehalfProject
  | NotificationSuggestionForFreelancerAfterReceiveReview
  | NotificationUpdateMilestone
  | NotificationUpgradeToNonFreeMembership
  | NotificationUploadFile
  | NotificationUpsellPlusTrial
  | NotificationUserReportsActionBidRestriction
  | NotificationWelcome
  | NotificationWinningDesignReadyForReview;

/**
 * A notification which is displayed in the notifications/updates feed on the
 * navigation bar.
 *
 * These are received via the Websocket.
 */
export type NotificationEntry =
  | NotificationArticleComment
  | (NotificationAward & { readonly state?: string }) // TODO: T37445 Make this a string enum
  | NotificationAwardBadge
  | NotificationAwardCredit
  | NotificationAwardMilestoneReminder
  | NotificationAwardReminder
  | NotificationAwardXp
  | NotificationBid
  | NotificationContestAwardedToEmployer
  | NotificationContestAwardedToFreelancer
  | NotificationContestEntry
  | NotificationContestEntryBoughtToEmployer
  | NotificationContestEntryBoughtToFreelancer
  | NotificationContestEntryCommentedToFreelancer
  | NotificationContestEntryRatedToFreelancer
  | NotificationContestEntryReconsideredToFreelancer
  | NotificationContestEntryRejectedToFreelancer
  | NotificationContestPCBNotification
  | NotificationContestPCBNotificationFullView
  | NotificationCreateMilestone
  | NotificationDenied
  | NotificationDraftContest
  | NotificationFailingProject
  | NotificationGiveGetChildPartialMilestoneRelease
  | NotificationGiveGetChildReceivedSignupBonus
  | NotificationGiveGetChildSignUp
  | NotificationGiveGetParentBonus
  | NotificationHighLtvAnnualDiscount
  | NotificationHireMe
  | NotificationInviteToContest
  | NotificationInviteUserBid
  | NotificationInvoiceRequested
  | NotificationLevelUp
  | NotificationNotifyFollower
  | NotificationProjectCompleted
  | NotificationQuickHireProject
  | NotificationReleaseMilestone
  | NotificationRequestEndProject
  | NotificationRequestMilestone
  | NotificationRequestToRelease
  | NotificationServiceApproved
  | NotificationServiceProjectEndingSeller
  | NotificationServiceProjectPostedSeller
  | NotificationServiceRejected
  | NotificationShowcaseSourceApproval
  | NotificationSignUpFreeTrialUpsell
  | NotificationTaskCreate
  | NotificationUpsellCrowdsourceFinding;

/**
 * Model used for the conversion of links with query params and fragments
 * which must be separated to be used in Angular.
 */
export interface Link {
  readonly url: string;
  readonly queryParams: { readonly [key: string]: string };
  readonly fragment: string;
}

export interface NotificationContestData {
  readonly isTest: boolean;
  readonly jobString: string;
  readonly linkUrl: string;
  readonly time: number;
  readonly title: string;
  readonly userId: number;
  readonly username: string;
}

export interface NotificationProjectData {
  readonly appendedDescr: string;
  readonly id: number;
  readonly imgUrl: string;
  readonly isTest: boolean;
  readonly skillIds: ReadonlyArray<number>;
  readonly jobString: string;
  readonly linkUrl: string;
  readonly text: string;
  readonly title: string;
  readonly userId: number;
  readonly username: string;
}

export type NotificationArticleComment = TimeMilliseconds & {
  readonly type: 'articleCommentReceived';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly articleAuthor: number; // The ID of author
    readonly articleName: string;
    readonly articleType: string; // Some enum?
    readonly commentBy: number;
    readonly commentId: number;
    readonly comment: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly publicName: string;
    readonly user: string;
  };
};

export type NotificationAward = TimeMilliseconds & {
  readonly type: 'award';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly bid: {
      readonly amount: number;
      readonly period: number;
    };
    readonly currency: {
      readonly code: string;
      readonly sign: string;
    };
    readonly acceptByTime?: number;
    readonly appendedDescr: string;
    readonly jobString: string;
    readonly id: number;
    readonly imgUrl?: string;
    readonly linkUrl?: string;
    readonly projIsHourly: boolean;
    readonly publicName: string;
    readonly state?: string;
    readonly title: string;
    readonly username: string;
    readonly userId: number;
  };
};

export type NotificationAwardBadge = TimeMilliseconds & {
  readonly type: 'awardBadge';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly descr: string;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly name: string;
  };
};

export type NotificationAwardCredit = TimeMilliseconds & {
  readonly type: 'awardCredit';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly amount: number;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
  };
};

export type NotificationAwardMilestoneReminder = TimeMilliseconds & {
  readonly type: 'awardMilestoneReminder';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly appendedDescr: string;
    readonly currencyCode: string;
    readonly currencyId: string | number;
    readonly currencySign: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly isHourlyProject: boolean;
    readonly publicName?: string;
    readonly title: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationAwardReminder = TimeMilliseconds & {
  readonly type: 'awardReminder';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly name: string;
    readonly username: string;
    readonly linkUrl: string;
    readonly imgUrl: string;
  };
};

export type NotificationAwardXp = TimeMilliseconds & {
  readonly type: 'awardXp';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly amount: number;
    readonly descr: string;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
  };
};

export interface NewsfeedBidEvent {
  readonly id: number;
  readonly bidderId: number;
  readonly projectId: number | string;
  readonly amount: number;
  readonly period: number;
  readonly description: string;
  readonly submitDate: number;
  readonly publicName: string;
  readonly score: number;
  readonly username: string;
  readonly currency?: Currency;
  readonly award?: string;
  readonly userAvatar?: string;
  readonly userRatingAvg?: number;
  readonly userRatingCount?: number;
  readonly userEarnings?: number | string;
  readonly awardStatus?: BidAwardStatusApi;
}

export type NotificationBid = TimeMilliseconds & {
  readonly type: 'bid';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly bidList: ReadonlyArray<NewsfeedBidEvent>;
    readonly amount: string;
    readonly bidAvg?: number;
    readonly bidCount: number;
    readonly bidId: number;
    readonly imgUrl?: string;
    readonly linkUrl?: string;
    readonly projectId: number;
    readonly projName: string;
    readonly projIsHourly: boolean;
    readonly projSeoUrl?: string;
    readonly publicName?: string;
    readonly title: string;
    readonly userId: number;
    readonly username: string;
    readonly description: string | null | undefined;
    readonly submitDate?: number;
    readonly currency: Currency;
    readonly period: string | undefined;
    readonly userAvatar?: string | undefined;
  };
};

export type NotificationContest = TimeMilliseconds & {
  readonly type: 'contest';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationContestData & {
    readonly buyer: string;
    readonly buyerUrl?: string;
    readonly currency?: string;
    readonly currencyCode: string;
    readonly exchangeRate: string;
    readonly imgUrl: string;
    readonly skillIds: ReadonlyArray<number>;
    readonly minBudget?: number;
    readonly maxBudget?: number;
  };
};

export type NotificationContestAwardedToEmployer = TimeMilliseconds & {
  readonly type: 'contestAwardedToEmployer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly contestSeoUrl?: string;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly entryId: string;
    readonly entryNumber: string;
    readonly entryCount: string;
    readonly freelancerCount: string;
    readonly imgUrl: undefined;
    readonly isBought: boolean;
    readonly linkUrl: string;
    readonly prize: number;
    readonly publicName?: string;
    readonly thumb: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationContestAwardedToFreelancer = TimeMilliseconds & {
  readonly type: 'contestAwardedToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly entryId: number;
    readonly entryNumber: string | number;
    readonly entryCount: string | number;
    readonly freelancerCount: string | number;
    readonly imgUrl: undefined;
    readonly thumb: string;
    readonly linkUrl: string;
    readonly prize: number;
    readonly publicName?: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationContestEntryBoughtToEmployer = TimeMilliseconds & {
  readonly type: 'contestEntryBoughtToEmployer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly entryId: string | number;
    readonly entryNumber: string | number;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly publicName?: string;
    readonly username: string;
  };
};

export type NotificationContestEntryBoughtToFreelancer = TimeMilliseconds & {
  readonly type: 'contestEntryBoughtToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly entryId: string | number;
    readonly entryNumber: string | number;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly publicName?: string;
    readonly username: string;
  };
};

export type NotificationContestEntry = TimeMilliseconds & {
  readonly type: 'contestEntry';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestHolder: string;
    readonly contestId: string;
    readonly contestName: string;
    readonly firstUser?: string;
    readonly firstUserPublicName?: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly secondUser?: string;
    readonly secondUserPublicName?: string;
    readonly userId: number;
  };
};

export type NotificationContestEntryRatedToFreelancer = TimeMilliseconds & {
  readonly type: 'contestEntryRatedToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly action: string;
    readonly contestId: number;
    readonly contestName: string;
    readonly employerId: number;
    readonly entriesUrl: string;
    readonly entryId: number;
    readonly entryNumber: number;
    readonly entryS3path: string;
    readonly entryThumb: string;
    readonly entryUrl: string;
    readonly freelancerId: number;
    readonly hasOtherEntriesRatedOrRejected: boolean;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly ratedOrRejectedEntriesCount: number;
    readonly rating: string;
  };
};

export type NotificationContestEntryRejectedToFreelancer = TimeMilliseconds & {
  readonly type: 'contestEntryRejectedToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly action: string;
    readonly contestId: number;
    readonly contestName: string;
    readonly employerId: number;
    readonly entriesUrl: string;
    readonly entryId: number;
    readonly entryNumber: number;
    readonly entryS3path: string;
    readonly entryThumb: string;
    readonly entryUrl: string;
    readonly freelancerId: number;
    readonly hasOtherEntriesRatedOrRejected: boolean;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly ratedOrRejectedEntriesCount: number;
    readonly rating: string;
  };
};

export type NotificationContestEntryReconsideredToFreelancer = TimeMilliseconds & {
  readonly type: 'contestEntryReconsideredToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly action: string;
    readonly contestId: number;
    readonly contestName: string;
    readonly employerId: number;
    readonly entriesUrl: string;
    readonly entryId: number;
    readonly entryNumber: number;
    readonly entryS3path: string;
    readonly entryThumb: string;
    readonly entryUrl: string;
    readonly freelancerId: number;
    readonly hasOtherEntriesRatedOrRejected: boolean;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly ratedOrRejectedEntriesCount: number;
    readonly rating: string;
  };
};

export type NotificationContestEntryCommentedToFreelancer = TimeMilliseconds & {
  readonly type: 'contestEntryCommentedToFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestId: number;
    readonly contestName: string;
    readonly entryNumber: number;
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationContestPCBNotification = TimeMilliseconds & {
  readonly type: 'contestPCBNotification';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestHolder: string;
    readonly contestId: string;
    readonly contestName: string;
    readonly firstUser?: string;
    readonly firstUserPublicName?: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly secondUser?: string;
    readonly secondUserPublicName?: string;
    readonly userId: number;
    readonly userCount: number;
  };
};

export type NotificationContestPCBNotificationFullView = TimeMilliseconds & {
  readonly type: 'contestPCBNotificationFullView';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestHolder: string | number;
    readonly contestName: string;
    readonly entryNumber?: string | number;
    readonly firstUser: string;
    readonly firstUserPublicName?: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly secondUser?: string;
    readonly secondUserPublicName?: string;
    readonly userId: string | number;
    readonly userCount: number;
  };
};

export type NotificationCreateMilestone = TimeMilliseconds & {
  readonly type: 'createMilestone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly accountId?: number;
    readonly amount: string | number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly projectId: string | number | null;
    readonly publicName?: string;
    readonly shortDescr: string;
    readonly title: string;
    readonly transId: number | null;
    readonly isInitialPayment: boolean;
  };
};

export type NotificationDenied = TimeMilliseconds & {
  readonly type: 'denyed';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly autoRepostProjectId?: number;
    readonly id: number;
    readonly imgUrl: string;
    readonly jobsUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly projectType: NotificationProjectType;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly userId: string | number;
    readonly username: string;
  };
};

export type NotificationDraftContest = TimeMilliseconds & {
  readonly type: 'draftContest';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestEditUrl?: string;
    readonly contestId: string;
    readonly contestName: string;
    readonly linkUrl: string;
    readonly imgUrl: string;
    readonly isPublished: boolean;
  };
};

export type NotificationFailingProject = TimeMilliseconds & {
  readonly type: 'failingProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly address?: string;
    readonly currency?: string;
    readonly currencyCode: string;
    readonly featured: boolean;
    readonly freeBidUntil?: number;
    readonly fulltime: boolean;
    readonly maxBudget?: number;
    readonly minBudget?: number;
    readonly nonpublic: boolean;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly submitDate: string;
  };
};

export type NotificationGiveGetChildReceivedSignupBonus = TimeMilliseconds & {
  readonly type: 'giveGetChildReceivedSignupBonus';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly parentId: number;
    readonly childId: number;
    readonly bonus: number;
    readonly currencyCode: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationGiveGetChildSignUp = TimeMilliseconds & {
  readonly type: 'giveGetChildSignUp';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly parentId: number;
    readonly childId: number;
    readonly childName: string;
    readonly bonus: number;
    readonly bonusRequirement: number;
    readonly currencyCode: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationGiveGetChildPartialMilestoneRelease = TimeMilliseconds & {
  readonly type: 'giveGetChildPartialMilestoneRelease';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly parentId: number;
    readonly childId: number;
    readonly childName: string;
    readonly bonusRequirement: number;
    readonly currencyCode: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationGiveGetParentBonus = TimeMilliseconds & {
  readonly type: 'giveGetParentBonus';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly parentId: number;
    readonly bonus: number;
    readonly currencyCode: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationHireMe = TimeMilliseconds & {
  readonly type: 'hireMe';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly acceptByTime?: number;
    readonly appendedDescr: string;
    readonly currency: {
      readonly code: string;
      readonly sign: string;
    };
    readonly id: number;
    readonly imgUrl: string;
    readonly jobString: string;
    readonly linkUrl: string;
    readonly period?: number;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly state?: string;
    readonly sum: number;
    readonly title: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationNotifyFollower = TimeMilliseconds & {
  readonly type: 'notifyfollower';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData;
};

export type NotificationHighLtvAnnualDiscount = TimeMilliseconds & {
  readonly type: 'highLtvAnnualDiscount';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly userDisplayName: string;
  };
};

export type NotificationInviteUserBid = TimeMilliseconds & {
  readonly type: 'inviteUserBid';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly inviteeId: number;
    readonly inviteeName: string;
    readonly maxBudget?: number;
    readonly minBudget?: number;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
  };
};

export type NotificationInviteToContest = TimeMilliseconds & {
  readonly type: 'inviteToContest';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly buyer: string | number; // The ID
    readonly buyerName: string;
    readonly buyerPublicName?: string;
    readonly buyerUrl: string;
    readonly contestRecommendedSkills: string;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly description: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly prize: number;
    readonly sellerId: string | number;
    readonly sellerName: string;
    readonly sellerPublicName?: string;
    readonly title: string;
    readonly type?: string;
  };
};

export type NotificationInvoiceRequested = TimeMilliseconds & {
  readonly type: 'invoiceRequested';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly imgUrl: string;
    readonly invoiceId: number;
    readonly linkUrl: string;
    readonly name: string;
    readonly publicName?: string;
    readonly sellerId: number;
    readonly seoUrl: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationInvoiceRequestChange = TimeMilliseconds & {
  readonly type: 'invoiceRequestChange';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly imgUrl?: string;
    readonly name: string;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly username: string;
  };
};

export type NotificationInvoiceWithdrawn = TimeMilliseconds & {
  readonly type: 'invoiceWithdrawn';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly amount: number;
    readonly currencyCode: string;
    readonly imgUrl?: string;
    readonly name: string;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly username: string;
  };
};

export type NotificationLevelUp = TimeMilliseconds & {
  readonly type: 'levelUp';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly level: string;
    readonly linkUrl: string;
    readonly membership: boolean;
    readonly perks: ReadonlyArray<{
      readonly description: string;
      readonly item: boolean;
      readonly magnitude: number;
      readonly name?: 'BidRefreshRate' | 'item';
      readonly symbol: string;
    }>;
    readonly username: string;
  };
};

export type NotificationLocalJobPosted = TimeMilliseconds & {
  readonly type: 'localJobPosted';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly currency?: string;
    readonly currencyCode: string;
    readonly exchangeRate: string;
    readonly featured: boolean;
    readonly freeBidUntil?: number;
    readonly fulltime: boolean;
    readonly isLocal: true;
    readonly maxBudget?: number;
    readonly minBudget?: number;
    readonly nonpublic: boolean;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly submitDate: string;
  };
};

export type NotificationRecruiterProject = TimeMilliseconds & {
  readonly type: 'recruiterProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly address?: string;
    readonly currency?: string;
    readonly currencyCode: string;
    readonly exchangeRate: string;
    readonly featured: boolean;
    readonly freeBidUntil?: number;
    readonly fulltime: boolean;
    readonly isLocal: boolean;
    readonly maxBudget?: number;
    readonly minBudget?: number;
    readonly nonpublic: boolean;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly submitDate: string;
  };
};

export type NotificationProject = TimeMilliseconds & {
  readonly type: 'project';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly address?: string;
    readonly currency?: string;
    readonly currencyCode: string;
    readonly exchangeRate: string;
    readonly featured: boolean;
    readonly freeBidUntil?: number;
    readonly fulltime: boolean;
    readonly maxBudget?: number;
    readonly minBudget?: number;
    readonly nonpublic: boolean;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly submitDate: string;
    readonly usdMaxbudget?: number;
    readonly usdMinbudget?: number;
  };
};

export type NotificationProjectCompleted = TimeMilliseconds & {
  readonly type: 'completed';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly projectId: number;
    readonly amount: string | number;
    readonly categoryName: string;
    readonly completeStatus: string; // TODO: T37445 Make this a string enum
    readonly currencyCode: string;
    readonly currencyId: string | number;
    readonly currencySign: string;
    readonly employerId: string | number;
    readonly employerPublicName?: string;
    readonly employerUsername: string;
    readonly expiredTimestamp?: number;
    readonly freelancerId: string | number;
    readonly freelancerPublicName?: string;
    readonly freelancerUsername: string;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly name: string;
    readonly selectionId: string | number;
    readonly seoUrl: string;
    readonly state?: string; // TODO: T37445 Make this a string enum
    readonly submitDate: string;
    readonly bidId?: string | number;
  };
};

export type NotificationProjectEmailVerificationRequired = TimeMilliseconds & {
  readonly type: 'projectEmailVerificationRequiredEvent';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly userId: number;
    readonly projectId?: number;
  };
};

export type NotificationQuickHireProject = TimeMilliseconds & {
  readonly type: 'quickHireProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationProjectData & {
    readonly currency?: { readonly code: string; readonly sign: string };
    readonly period?: number;
    readonly projIsHourly: boolean;
    readonly publicName?: string;
    readonly sum?: number;
  };
};

export type NotificationReleaseMilestone = TimeMilliseconds & {
  readonly type: 'releaseMilestone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: string | number;
    readonly amount: string | number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly otherReason: string;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly submitDate: string;
    readonly title: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationRequestEndProject = TimeMilliseconds & {
  readonly type: 'requestEndProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly id: number;
    readonly accountId: string | number;
    readonly bidId: string | number;
    readonly categoryName: string;
    readonly dayCount: string | number;
    readonly imgUrl: string;
    readonly linkUrl: undefined;
    readonly link: Link;
    readonly name: string;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly submitDate: string;
    readonly userId: string | number;
    readonly username: string;
  };
};

export type NotificationRequestMilestone = TimeMilliseconds & {
  readonly type: 'requestMilestone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly currencyId: number;
    readonly currencySign: string;
    readonly description: string;
    readonly id: number;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly publicName?: string;
    readonly requestId: number;
    readonly sellerId: number;
    readonly seoUrl: string;
    readonly state?: string; // TODO: T37445 Make this a string enum
    readonly submitDate: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationRequestToRelease = TimeMilliseconds & {
  readonly type: 'requestToRelease';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly descr: string;
    // img: ???;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly publicName?: string;
    readonly seoUrl: string;
    readonly state?: string; // TODO: T37445 Make this a string enum
    readonly tranId: number;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationServiceProjectEndingSeller = TimeMilliseconds & {
  readonly type: 'serviceProjectEndingSeller';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly bidId: number;
    readonly buyerId: number;
    readonly buyerName: string;
    readonly hoursRemaining: number;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly orderStartDate: string;
    readonly projectId: number;
    readonly projectName: string;
    readonly projectUrl: string;
    readonly sellerId: number;
    readonly sellerName: string;
    readonly serviceId: number;
    readonly serviceName: string;
  };
};

export type NotificationServiceProjectPostedSeller = TimeMilliseconds & {
  readonly type: 'serviceProjectPostedSeller';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly bidId: number;
    readonly buyerId: number;
    readonly buyerImgUrl: string;
    readonly buyerName: string;
    readonly buyerPublicName?: string;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly orderEndDate: string;
    readonly orderStartDate: string;
    readonly projectCost: number;
    // project_duration: ???;
    readonly projectId: number;
    // project_milestones: ???;
    readonly projectName: string;
    readonly projectUrl: string;
    readonly sellerId: number;
    readonly sellerImgUrl: string;
    readonly sellerName: string;
    readonly sellerPublicName: string;
    readonly serviceId: number;
    readonly serviceName: string;
    readonly serviceUrl: string;
  };
};

export interface NotificationServiceData {
  readonly imgUrl: undefined;
  readonly linkUrl: string;
  readonly serviceId: number;
  readonly serviceName: string;
  readonly serviceUrl: string;
  readonly serviceDuration: string;
  readonly serviceCost: number;
  readonly currencySign: string;
  readonly currencyCode: string;
  readonly serviceImg: string; // A URL
}

export type NotificationServiceApproved = TimeMilliseconds & {
  readonly type: 'serviceApproved';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationServiceData;
};

export type NotificationServiceRejected = TimeMilliseconds & {
  readonly type: 'serviceRejected';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationServiceData;
};

export type NotificationSignUpFreeTrialUpsell = TimeMilliseconds & {
  readonly type: 'signUpFreeTrialUpsell';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly trialPackageName: string;
  };
};

export type NotificationUpsellCrowdsourceFinding = TimeMilliseconds & {
  readonly type: 'upsellCrowdsourceFinding';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly linkUrl: undefined;
    readonly projectName: string;
  };
};

export type NotificationXpContest = TimeMilliseconds & {
  readonly type: 'xpContest';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: NotificationContestData & {
    readonly currency: string;
    readonly currencyCode: string;
    readonly imgUrl: string;
    readonly minBudget?: number;
    readonly maxBudget?: number;
  };
};

export type NotificationTaskCreate = TimeMilliseconds & {
  readonly type: 'tasklistCreateV1';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: TaskApi & {
    readonly imgUrl: string;
    readonly linkUrl: string;
  };
};

export type NotificationAcceptDisputeOffer = TimeMilliseconds & {
  readonly type: 'acceptDisputeOffer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly dispute_id: string;
    readonly id: number;
    readonly imgUrl: undefined;
    readonly linkUrl: string;
    readonly name: string;
    readonly publicName: string;
    readonly userId: string;
    readonly username: string;
  };
};

export type NotificationAccepted = TimeMilliseconds & {
  readonly type: 'accepted';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly id: number;
    readonly imgUrl: string;
    readonly isAutomaticPayments: boolean;
    readonly isHourly: boolean;
    readonly milestoneCreated: boolean;
    readonly name: string;
    readonly projectType: NotificationProjectType;
    readonly publicName: string;
    readonly seoUrl: string;
    readonly userName: string;
    readonly userId: number;
  };
};

export type NotificationActivateFreelancer = TimeMilliseconds & {
  readonly type: 'activateFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly id: number; // User id
    readonly imgUrl: undefined;
    readonly key: string;
    readonly updatedProfile: boolean;
    readonly verifiedEmail: boolean;
  };
};

export type NotificationAdminForceVerifyPhone = TimeMilliseconds & {
  readonly type: 'adminForceVarifyPhone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
  };
};

export type NotificationCompleteContestReview = TimeMilliseconds & {
  readonly type: 'completeContestReview';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly projectName: string;
    readonly userId: number;
    readonly username: string;
    readonly publicName: string;
    readonly message: string;
    readonly rating: string;
    readonly seoUrl?: string;
    readonly imgUrl?: string;
  };
};

export type NotificationCompleteReview = TimeMilliseconds & {
  readonly type: 'completeReview';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly invoiceId: number | null;
    readonly message: string;
    readonly projectName: string;
    readonly publicName: string;
    readonly rating: string;
    readonly seoUrl: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationContestPCB = TimeMilliseconds & {
  readonly type: 'contest_pcb';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly messagesOverWs: number;
    readonly imgUrl?: string;
    readonly contestId: number;
    readonly contestSeoUrl: string;
    readonly contestName: string;
    readonly publicName?: string;
    readonly username: string;
  };
};

export type NotificationContestComplete = TimeMilliseconds & {
  readonly type: 'contestComplete';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly contestUrl: string;
    readonly imgUrl?: string;
    readonly publicName: string;
    readonly reviewId: number;
    readonly toFreelancer: boolean;
    readonly username: string;
    readonly entryId: number;
  };
};

export type NotificationContestCreated = TimeMilliseconds & {
  readonly type: 'contestCreated';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly contestName: string;
    readonly contestUrl: string;
    readonly contestId: string;
  };
};

export interface NewsfeedContestEntry {
  readonly id: number;
  readonly userId: number;
  readonly entryNumber: number;
  readonly entryThumb: string;
  readonly entryUrl: string;
  readonly imgUrl?: string;
  readonly username: string;
  readonly publicName?: string;
  readonly time: number;
}

export type NotificationContestEntryCreated = TimeMilliseconds & {
  readonly type: 'contestEntryCreated';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly entriesList: ReadonlyArray<NewsfeedContestEntry>;
    readonly entryId: number;
    readonly contestId: number;
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly entryNumber: number;
    readonly entryThumb: string;
    readonly entryUrl: string;
    readonly freelancerPublicName: string;
    readonly freelancerUsername: string;
    readonly freelancerId: number;
    readonly imgUrl?: string;
    readonly time: number;
  };
};

export interface NewsfeedContestEntryRated {
  readonly id: number;
  readonly rating: number;
  readonly thumb: string;
  readonly time?: number;
}

export type NotificationContestEntryRated = TimeMilliseconds & {
  readonly type: 'contestEntryRated';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly entriesList: ReadonlyArray<NewsfeedContestEntryRated>;
    readonly contestId: number;
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly employerPublicName: string;
    readonly employerUsername: string;
    readonly entryId: number;
    readonly entryNumber: string;
    readonly entryThumb: string;
    readonly entryUrl: string;
    readonly imgUrl?: string;
    readonly rating: number;
    readonly time: number;
  };
};

export type NotificationContestExpired = TimeMilliseconds & {
  readonly type: 'contestExpired';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly contestEndDate: number;
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly isExtended: boolean;
  };
};

export type NotificationContestReviewPosted = TimeMilliseconds & {
  readonly type: 'contestreviewposted';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestId: number;
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly imgUrl?: string;
    readonly publicName: string;
    readonly state?: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationCustomAdminNotification = TimeMilliseconds & {
  readonly type: 'customAdminNotification';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly description: string;
    readonly id: string; // Usually an empty string
    readonly imgUrl: undefined;
    readonly linkText: string;
    readonly linkUrl: string;
    readonly text: string;
    readonly weight?: string;
  };
};

export type NotificationDirectTransferDone = TimeMilliseconds & {
  readonly type: 'directTransferDone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly amount: string;
    readonly currencyCode: string;
    readonly id: number; // Project id
    readonly name: string;
    readonly otherReason: string;
    readonly publicName: string;
    readonly seoUrl: string;
    readonly userName: string;
    readonly userId: string;
  };
};

export type NotificationEditAwardedBidAccepted = TimeMilliseconds & {
  readonly type: 'editAwardedBidAccepted';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly buyerName: string;
    readonly buyerPublicName: string;
    readonly currencyCode: string;
    readonly editBidDetails: {
      readonly newAmount: number;
      readonly newPeriod: number;
    };
    readonly id: number;
    readonly imgUrl?: string;
    readonly linkUrl: string;
    readonly projName: string;
  };
};

export type NotificationEmailChange = TimeMilliseconds & {
  readonly type: 'emailChange';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly newEmail: string;
    readonly requestId: number;
  };
};

export type NotificationEscalateDispute = TimeMilliseconds & {
  readonly type: 'escalateDispute';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly disputeId: string;
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly projectName: string;
    readonly publicName: string;
    readonly time: number;
    readonly username: string;
  };
};

export type NotificationInvoiceFeedback = TimeMilliseconds & {
  readonly type: 'invoiceFeedback';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly freelancerId: number;
    readonly imgUrl: undefined;
    readonly invoiceId?: number;
    readonly projectId: number;
    readonly projectName: string;
    readonly seoUrl: string;
  };
};

export type NotificationInvoicePaid = TimeMilliseconds & {
  readonly type: 'invoicePaid';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly amount: number;
    readonly currency: {
      readonly code: string;
      readonly sign: string;
    };
    readonly invoiceId: number;
    readonly projectName: string;
    readonly publicName: string;
    readonly username: string;
    readonly projectId: number;
    readonly seoUrl: string;
  };
};

export enum KYCStatus {
  APPROVED = 'approved',
  DECLINED = 'declined',
  PENDING = 'pending',
  RECOMMENDED = 'recommended',
  REQUIRED = 'required',
}

export type NotificationKYC = TimeMilliseconds & {
  readonly type: 'kyc';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly country?: string;
    readonly imgUrl: undefined;
    readonly isCorporate: boolean;
    readonly status: KYCStatus;
  };
};

export type NotificationMakeDisputeOffer = TimeMilliseconds & {
  readonly type: 'makeDisputeOffer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly amount: number;
    readonly currency: {
      readonly code: string;
      readonly sign: string;
    };
    readonly disputeId: string;
    readonly projectId: number; // Project id
    readonly imgUrl: string;
    readonly linkUrl: string;
    readonly projectName: string;
    readonly publicName: string;
    readonly senderRole: string; // Enum Employer/Freelancer
    readonly username: string;
  };
};

export type NotificationNewDispute = TimeMilliseconds & {
  readonly type: 'newDispute';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly disputeId: number;
    readonly imgUrl?: string;
    readonly linkUrl: string;
    readonly projectId: number;
    readonly projectName: string;
    readonly publicName: string;
    readonly reason?: string;
    readonly time: number;
    readonly username: string;
  };
};

export interface LinkElement {
  readonly text?: string;
  readonly url: string;
  readonly params?: { readonly [key: string]: any };
}

export interface ParsedLinksString {
  readonly text?: string;
  readonly link?: LinkElement;
}

export type NotificationPendingFunds = TimeMilliseconds & {
  readonly type: 'pendingFunds';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly amount: number;
    readonly currency: {
      readonly code: string;
      readonly sign: string;
    };
    readonly descr: ReadonlyArray<ParsedLinksString>;
    readonly message: string;
    readonly reason: string;
  };
};

export type NotificationPostDraftProject = TimeMilliseconds & {
  readonly type: 'postDraftProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly projectId: number;
    readonly projectName: string;
  };
};

export type NotificationPrizeDispersedEmployer = TimeMilliseconds & {
  readonly type: 'prizeDispersedEmployer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly freelancerPublicName?: string;
    readonly freelancerUsername?: string;
    readonly hasWinner: boolean;
    readonly imgUrl?: string;
  };
};

export type NotificationPrizeDispersedFreelancer = TimeMilliseconds & {
  readonly type: 'prizeDispersedFreelancer';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly contestName: string;
    readonly contestSeoUrl: string;
    readonly imgUrl?: string;
  };
};

export type NotificationProjectHireMeExpired = TimeMilliseconds & {
  readonly type: 'projectHireMeExpired';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly autoRepostProjectId?: number;
    readonly autoRepostProjectName?: string;
    readonly imgUrl: string | undefined;
    readonly jobsUrl: string;
    readonly linkUrl: string;
    readonly name: string;
    readonly projectId: number;
    readonly projectName: string;
    readonly publicName: string;
    readonly seoUrl: string;
    readonly userId: number;
    readonly username: string;
  };
};

export type NotificationProjectSharedWithYou = TimeMilliseconds & {
  readonly type: 'projectSharedWithYou';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly actingInviterUsername?: string | undefined;
    readonly actingInviterPublicName?: string | undefined;
    readonly employerPublicName: string;
    readonly employerUsername: string;
    readonly imgUrl: undefined;
    readonly projectId: number;
    readonly projectName: string;
  };
};

export type NotificationRejected = TimeMilliseconds & {
  readonly type: 'rejected';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly rejectReasons?: ReadonlyArray<string>;
    readonly additionalMsg?: string;
    readonly projectName: string;
    readonly projectId: number;
  };
};

export type NotificationReleasePartMilestone = TimeMilliseconds & {
  readonly type: 'releasePartMilestone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly id: number;
    readonly imgUrl?: string;
    readonly leftAmount: number;
    readonly linkUrl: string;
    readonly name: string;
    readonly otherReason: string;
    readonly publicName: string;
    readonly tranId: number;
    readonly userName: string;
  };
};

export type NotificationRemindUseBids = TimeMilliseconds & {
  readonly type: 'remindUseBids';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly username: string;
    readonly bidsRemaining: string;
  };
};

export enum QHPCreateType {
  INLINE_REHIRE = 'inline-rehire',
  NORMAL = 'normal',
}

export type NotificationReviewActivate = TimeMilliseconds & {
  readonly type: 'reviewActivate';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly currencyId: number;
    readonly id: number;
    readonly imgUrl: undefined;
    readonly isAutomaticPayments: boolean;
    readonly isHourly: boolean;
    readonly isMilestoneCreated: boolean;
    readonly isQHP: boolean;
    readonly name: string;
    readonly notShowEmployerFee: boolean;
    readonly projectCreateType: QHPCreateType | null;
    readonly quickhireFreelancerId: number | null;
    readonly quickhireFreelancerPublicName: string | null;
    readonly quickhireFreelancerUsername: string | null;
    readonly seoUrl: string; // Project ID
  };
};

export type NotificationReviewPostedNew = TimeMilliseconds & {
  readonly type: 'reviewpostednew';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly state?: string;
    readonly imgUrl?: string;
    readonly invoiceId?: number;
    readonly projectId: number;
    readonly projectName: string;
    readonly isHourlyProject: boolean;
    readonly publicName: string;
    readonly seoUrl: string;
    readonly username: string;
    readonly userId: number;
  };
};

export type NotificationRevoke = TimeMilliseconds & {
  readonly type: 'revoked';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly project: {
      readonly id: number;
      readonly ownerId: number;
      readonly title: string;
      readonly seoUrl: string;
      readonly hireme: boolean;
    };
    readonly bid: {
      readonly id: number;
      readonly bidderId: number;
      readonly awardStatus: BidAwardStatusApi;
    };
    readonly awardeeId: number;
    readonly imgUrl: string;
  };
};

export type NotificationSendDisputeMessage = TimeMilliseconds & {
  readonly type: 'sendDisputeMessage';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly disputeId: string;
    readonly projectId: number;
    readonly linkUrl: string;
    readonly message: string;
    readonly projectName: string;
    readonly publicName: string;
    readonly username: string;
    readonly userId: string;
  };
};

export type NotificationSuggestionForFreelancerAfterReceiveReview = TimeMilliseconds & {
  readonly type: 'suggestionForFreelancerAfterReceiveReview';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl: undefined;
    readonly projectName: string;
    readonly seoUrl: string;
    readonly username: string;
  };
};

export type NotificationUpdateMilestone = TimeMilliseconds & {
  readonly type: 'updateMilestone';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountId: number;
    readonly amount: number;
    readonly bidId: number;
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly description: string;
    readonly imgUrl?: string;
    readonly isSelected: boolean;
    readonly linkUrl: string;
    readonly name: string;
    readonly oldAmount: number;
    readonly publicName?: string;
    readonly requestId: number;
    readonly sellerId: number;
    readonly username: string;
    readonly id: number;
  };
};

export type NotificationUpgradeToNonFreeMembership = TimeMilliseconds & {
  readonly type: 'upgradeToNonFreeMembership';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly currencyCode: string;
    readonly currentPlan: string | null;
    readonly freeTrial: boolean | null;
    readonly imgUrl: undefined;
    readonly newPlan: string;
    readonly price: number | null;
    readonly refundedAmount: number | null;
    readonly start: string | null;
    readonly end: string | null;
    readonly tax: string | null;
    readonly timeUnit: string | null;
    readonly type: string;
  };
};

export interface NewsfeedUploadFile {
  readonly id?: number;
  readonly name?: string;
  readonly size?: string;
  readonly isDriveFile?: boolean;
  readonly time?: number;
}

export type NotificationUploadFile = TimeMilliseconds & {
  readonly type: 'uploadFile';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly filesList: ReadonlyArray<NewsfeedUploadFile>;
    readonly imgUrl?: string;
    readonly projectId: number;
    readonly projectName: string;
    readonly projectSeoUrl: string;
    readonly userId: number;
    readonly publicName?: string;
    readonly username: string;
    readonly bidId: number;
    readonly file: NewsfeedUploadFile;
    readonly time: number;
  };
};

export type NotificationUpsellPlusTrial = TimeMilliseconds & {
  readonly type: 'upsellPlusTrial';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly currencyCode: string;
    readonly currencySign: string;
    readonly extendPrice: string;
    readonly isBoth: boolean;
    readonly isEmployer: boolean;
    readonly isFreelancer: boolean;
    readonly imgUrl?: string;
    readonly price: number;
    readonly taxName: string | undefined;
    readonly benefits: {
      readonly bidsLimit: {
        readonly benefitValue: number;
      };
      readonly offsiteInvoice: {
        readonly benefitValue: number;
      };
      readonly skillsLimit: {
        readonly benefitValue: number;
      };
    };
    readonly trialPackage: {
      readonly packageId: number;
      readonly package: {
        readonly upperName: string;
      };
    };
    readonly trialPrice: string;
  };
};

export type NotificationWelcome = TimeMilliseconds & {
  readonly type: 'welcome';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly accountSetup: boolean;
    readonly imgUrl: undefined;
    readonly siteName?: string;
  };
};

export type NotificationWinningDesignReadyForReview = TimeMilliseconds & {
  readonly type: 'winningDesignReadyForReview';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly autoReleasePrizeTime: number;
    readonly contestName: string;
    readonly contestUrl: string;
    readonly entryId: string;
    readonly imgUrl: string;
    readonly winnerName: string;
    readonly winnerProfileUrl: string;
    readonly winnerPublicName: string;
  };
};

export type NotificationShowcaseSourceApproval = TimeMilliseconds & {
  readonly type: 'showcaseSourceApproval';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly imgUrl?: string;
    readonly linkUrl: string;
    readonly projectId: number;
    readonly projectTitle: string;
    readonly projectType: string;
  };
};

export enum NotificationProjectType {
  HIRE_ME = 'hireMe',
  NORMAL = 'normal',
}

export type NotificationUserReportsActionBidRestriction = TimeMilliseconds & {
  readonly type: 'userReportsActionBidRestriction';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly action: string;
    readonly endDate: number;
    readonly id: number;
    readonly imgUrl: undefined;
    readonly startDate: number;
  };
};

export type NotificationSubmitOnBehalfProject = TimeMilliseconds & {
  readonly type: 'submitOnBehalfProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly onBehalfProjectId: number;
    readonly projectTitle: string;
    readonly posterId: number;
    readonly posterDisplayName: string;
    readonly posterUsername: string;
    readonly nominatedEmail: string;
    readonly nominatedUserDisplayName?: string;
    readonly nominatedUserUsername?: string;
    readonly imgUrl?: string;
  };
};

export type NotificationPostOnBehalfProject = TimeMilliseconds & {
  readonly type: 'postOnBehalfProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly projectTitle: string;
    readonly projectId: number;
    readonly projectOwnerDisplayName: string;
    readonly projectOwnerUsername: string;
    readonly imgUrl?: string;
  };
};

export type NotificationRejectOnBehalfProject = TimeMilliseconds & {
  readonly type: 'rejectOnBehalfProject';
  readonly parent_type: 'notifications';
  readonly id: string;
  readonly data: {
    readonly onBehalfProjectId: number;
    readonly projectTitle: string;
    readonly nominatedUserDisplayName: string;
    readonly nominatedUserUsername: string;
    readonly nominatedUserId: number;
    readonly imgUrl?: string;
  };
};
