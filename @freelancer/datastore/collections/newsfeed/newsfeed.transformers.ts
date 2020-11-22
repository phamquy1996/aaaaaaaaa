import {
  TimeMilliseconds,
  WebsocketAcceptDisputeOfferEvent,
  WebsocketAcceptedEvent,
  WebsocketActionPayload,
  WebsocketAdminForceVerifyPhoneEvent,
  WebsocketArticleCommentEvent,
  WebsocketAwardEvent,
  WebsocketBidEvent,
  WebsocketCompleteReviewEvent,
  WebsocketContestAwardedToEmployerEvent,
  WebsocketContestAwardedToFreelancerEvent,
  WebsocketCreateMilestoneEvent,
  WebsocketDeniedEvent,
  WebsocketDraftContestEvent,
  WebsocketEscalateDisputeEvent,
  WebsocketHireMeEvent,
  WebsocketInviteToContestEvent,
  WebsocketInviteUserBidEvent,
  WebsocketInvoiceFeedbackEvent,
  WebsocketInvoicePaidEvent,
  WebsocketInvoiceRequestedChangeEvent,
  WebsocketInvoiceRequestedEvent,
  WebsocketMakeDisputeOfferEvent,
  WebsocketNewDisputeEvent,
  WebsocketPendingFundsEvent,
  WebsocketPostOnBehalfProjectEvent,
  WebsocketProjectCompletedEvent,
  WebsocketProjectData,
  WebsocketProjectEmailVerificationRequiredEvent,
  WebsocketProjectHireMeExpiredEvent,
  WebsocketRejectOnBehalfProjectEvent,
  WebsocketReleaseMilestoneEvent,
  WebsocketReleasePartMilestoneEvent,
  WebsocketRequestEndProjectEvent,
  WebsocketRequestMilestoneEvent,
  WebsocketRequestToReleaseEvent,
  WebsocketReviewActivateEvent,
  WebsocketReviewPostedEvent,
  WebsocketRevokedEvent,
  WebsocketSendDisputeMessageEvent,
  WebsocketShowcaseSourceApprovalEvent,
  WebsocketSubmitOnBehalfProjectEvent,
  WebsocketUpdateMilestoneEvent,
  WebsocketUpgradeToNonFreeMembershipEvent,
  WebsocketUpsellPlusTrialEvent,
  WebsocketUserReportsActionBidRestrictionEvent,
} from '@freelancer/datastore/core';
import { assertNever, isDefined, toNumber } from '@freelancer/utils';
import { NewsfeedApiEntry } from './newsfeed.backend-model';
import {
  Link,
  LinkElement,
  NewsfeedBidEvent,
  NewsfeedContestEntry,
  NewsfeedContestEntryRated,
  NewsfeedEntry,
  NewsfeedUploadFile,
  NotificationAcceptDisputeOffer,
  NotificationAccepted,
  NotificationAdminForceVerifyPhone,
  NotificationArticleComment,
  NotificationAward,
  NotificationBid,
  NotificationCompleteReview,
  NotificationContestAwardedToEmployer,
  NotificationContestAwardedToFreelancer,
  NotificationCreateMilestone,
  NotificationDenied,
  NotificationDraftContest,
  NotificationEntry,
  NotificationEscalateDispute,
  NotificationHireMe,
  NotificationInviteToContest,
  NotificationInviteUserBid,
  NotificationInvoiceFeedback,
  NotificationInvoicePaid,
  NotificationInvoiceRequestChange,
  NotificationInvoiceRequested,
  NotificationMakeDisputeOffer,
  NotificationNewDispute,
  NotificationPendingFunds,
  NotificationPostOnBehalfProject,
  NotificationProjectCompleted,
  NotificationProjectData,
  NotificationProjectEmailVerificationRequired,
  NotificationProjectHireMeExpired,
  NotificationRejectOnBehalfProject,
  NotificationReleaseMilestone,
  NotificationReleasePartMilestone,
  NotificationRequestEndProject,
  NotificationRequestMilestone,
  NotificationRequestToRelease,
  NotificationReviewActivate,
  NotificationReviewPostedNew,
  NotificationRevoke,
  NotificationSendDisputeMessage,
  NotificationShowcaseSourceApproval,
  NotificationSubmitOnBehalfProject,
  NotificationUpdateMilestone,
  NotificationUpgradeToNonFreeMembership,
  NotificationUpsellPlusTrial,
  NotificationUserReportsActionBidRestriction,
  ParsedLinksString,
} from './newsfeed.model';

export type NewsFeedApiEntrySkipped = TimeMilliseconds & {
  readonly type: undefined;
  readonly parent_type: 'notifications';
  readonly id: string;
};

export function isTestEntry(entry: NewsfeedApiEntry) {
  switch (entry.type) {
    case 'contest':
    case 'failingProject':
    case 'localJobPosted':
    case 'notifyfollower':
    case 'project':
    case 'quickHireProject':
    case 'recruiterProject':
    case 'xpContest':
      // case 'localJobsMobile':
      return entry.data.isTest;
    default:
      return false;
  }
}

export function isNewsfeedEntry(
  entry: NewsfeedEntry | NewsFeedApiEntrySkipped,
): entry is NewsfeedEntry {
  return entry.type !== undefined;
}

export function isNotificationEntry(
  entry: NotificationEntry | NewsFeedApiEntrySkipped,
): entry is NotificationEntry {
  return entry.type !== undefined;
}

export function newsfeedApiEntrySkipped(
  entry: NewsfeedApiEntry,
): NewsFeedApiEntrySkipped {
  return {
    type: undefined,
    parent_type: 'notifications',
    id: entry.id,
    time: 0,
  };
}

export function userDisplayName(
  username: string,
  publicName: string | undefined | null,
): string {
  return publicName || username;
}

/**
 * Transform a link with query params and fragments which must be separated
 * to be used in Angular.
 */
export function transformLinkUrl(linkUrl: string): Link {
  // Link may have query params, so we try to extract those.
  const queryParams = linkUrl
    .split(/[?&]/)
    .filter(queryParam => queryParam.indexOf('=') !== -1)
    .map(queryParam => {
      const [key, value] = queryParam.split('=');
      return { [key]: value };
    })
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  // Grab the first fragment in the URL and trust that is the only one.
  const [, fragment] = linkUrl.split(/[#]/);

  // Get the URL without params or fragments.
  const [url] = linkUrl.split(/[?&#]/);

  return {
    url,
    queryParams,
    fragment,
  };
}

export function transformProjectData(
  data: WebsocketProjectData,
): NotificationProjectData {
  return {
    appendedDescr: data.appended_descr,
    id: data.id,
    imgUrl: data.imgUrl,
    isTest: data.isTest,
    skillIds: data.jobs ? data.jobs.map(Number) : [],
    jobString: data.jobString,
    linkUrl: data.linkUrl,
    text: data.text,
    title: data.title,
    userId: toNumber(data.userId),
    username: data.userName,
  };
}

export function transformAcceptedApiEntry(
  entry: WebsocketAcceptedEvent,
): (TimeMilliseconds & NotificationAccepted) | NewsFeedApiEntrySkipped {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      id: entry.data.id,
      imgUrl: entry.data.img.profile_logo_url,
      isAutomaticPayments: entry.data.isAutomaticPayments,
      isHourly: entry.data.isHourly,
      milestoneCreated: entry.data.milestoneCreated,
      name: entry.data.name,
      projectType: entry.data.projectType,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      userName: entry.data.userName,
      userId: entry.data.userId,
    },
  };
}

export function transformAcceptDisputeOfferApiEntry(
  entry: WebsocketAcceptDisputeOfferEvent,
): TimeMilliseconds & NotificationAcceptDisputeOffer {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      dispute_id: entry.data.dispute_id,
      id: entry.data.id,
      imgUrl: undefined,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformAdminForceVerifyPhoneApiEntry(
  entry: WebsocketAdminForceVerifyPhoneEvent,
): TimeMilliseconds & NotificationAdminForceVerifyPhone {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    time: entry.timestamp * 1000,
    id: entry.id,
    data: {
      imgUrl: undefined,
    },
  };
}

export function transformArticleCommentApiEntry(
  entry: WebsocketArticleCommentEvent,
): TimeMilliseconds & NotificationArticleComment {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      articleAuthor: toNumber(entry.data.article_author), // The ID of author
      articleName: entry.data.article_name,
      articleType: entry.data.article_type, // Some enum?
      commentBy: toNumber(entry.data.comment_by),
      commentId: toNumber(entry.data.comment_id),
      comment: entry.data.comment,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      publicName: entry.data.publicName,
      user: entry.data.user,
    },
  };
}

export function transformAwardApiEntry(
  entry: WebsocketAwardEvent,
  userId: string,
): (TimeMilliseconds & NotificationAward) | NewsFeedApiEntrySkipped {
  // Only show to bidder
  if (toNumber(userId) !== entry.data.apiMessage.bid.bidder_id) {
    return newsfeedApiEntrySkipped(entry);
  }

  if (!entry.state && !entry.data.acceptByTime) {
    return newsfeedApiEntrySkipped(entry);
  }
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      acceptByTime: entry.data.acceptByTime
        ? entry.data.acceptByTime * 1000
        : undefined,
      appendedDescr: entry.data.appended_descr,
      bid: {
        amount: toNumber(entry.data.bid.bidAmount),
        period: toNumber(entry.data.bid.bidPeriod),
      },
      currency: {
        code: entry.data.currencycode,
        sign: entry.data.currencysign,
      },
      id: entry.data.id,
      imgUrl: entry.data.imgUrl,
      jobString: entry.data.jobString,
      linkUrl: entry.data.linkUrl,
      projIsHourly: entry.data.projIsHourly,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      state: entry.state,
      title: entry.data.title,
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformBidApiEntry(
  entry: WebsocketBidEvent,
  userId: string,
): TimeMilliseconds & NotificationBid {
  return {
    type: 'bid',
    parent_type: entry.parent_type,
    // TODO: This breaks pagination as we get less entries than we asked the API for
    id: `${userId}:bid:${entry.data.projectId}`,
    time: entry.timestamp * 1000,
    data: {
      bidList: [],
      projectId: toNumber(entry.data.projectId),
      amount: entry.data.amount,
      bidAvg: toNumber(entry.data.bidAvg),
      bidCount: entry.data.bidCount ? toNumber(entry.data.bidCount) : 0,
      bidId: toNumber(entry.data.bid.id),
      imgUrl: !entry.data.imgUrl.endsWith('/img/unknown.png')
        ? entry.data.imgUrl
        : undefined,
      linkUrl: `${entry.data.linkUrl}?gotoBid=${entry.data.bid.id}`,
      projName: entry.data.projName,
      projIsHourly: entry.data.projIsHourly,
      projSeoUrl: entry.data.linkUrl,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      title: entry.data.title,
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
      description: entry.data.bid.descr,
      currency: {
        id: toNumber(entry.data.currencyId),
        code: entry.data.currencyCode,
        sign: entry.data.currency,
      },
      submitDate: entry.data.bid.submitdate_ts
        ? entry.data.bid.submitdate_ts * 1000
        : undefined,
      userAvatar: entry.data.bid.user
        ? entry.data.bid.user.logo_Url
        : undefined,
      period: entry.data.bid.period,
    },
  };
}

export function transformContestAwardedToEmployerApiEntry(
  entry: WebsocketContestAwardedToEmployerEvent,
): TimeMilliseconds & NotificationContestAwardedToEmployer {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      contestName: entry.data.contestName,
      contestSeoUrl: entry.data.contestSEOURL,
      currencyCode: entry.data.currencyCode,
      currencySign: entry.data.currencySign,
      entryCount: entry.data.entryCount,
      entryId: entry.data.entry_id,
      entryNumber: entry.data.entry_number,
      freelancerCount: entry.data.freelancerCount,
      imgUrl: undefined,
      isBought: entry.data.isBought,
      linkUrl: entry.data.linkUrl,
      prize: toNumber(entry.data.prize),
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      thumb: entry.data.thumb,
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformContestAwardedToFreelancerApiEntry(
  entry: WebsocketContestAwardedToFreelancerEvent,
): TimeMilliseconds & NotificationContestAwardedToFreelancer {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      contestName: entry.data.contestName,
      contestSeoUrl: entry.data.contestSEOURL,
      currencyCode: entry.data.currencyCode,
      currencySign: entry.data.currencySign,
      entryCount: entry.data.entryCount,
      entryId: toNumber(entry.data.entry_id),
      entryNumber: entry.data.entry_number,
      freelancerCount: entry.data.freelancerCount,
      imgUrl: undefined,
      thumb: entry.data.thumb,
      linkUrl: entry.data.linkUrl,
      prize: toNumber(entry.data.prize),
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
    },
  };
}

export function transformCompleteReviewApiEntry(
  entry: WebsocketCompleteReviewEvent,
): TimeMilliseconds & NotificationCompleteReview {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    // De-duplicate reviews in the newsfeed
    // TODO: This breaks pagination as we get less entries than we asked the API for
    id: `${entry.type}-${entry.data.id}`,
    time: entry.timestamp * 1000,
    data: {
      imgUrl: entry.data.img ? entry.data.img.profile_logo_url : undefined,
      invoiceId: entry.data.invoice_id,
      message: entry.data.message,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      rating: entry.data.rating,
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformCreateMilestoneApiEntry(
  entry: WebsocketCreateMilestoneEvent,
): TimeMilliseconds & NotificationCreateMilestone {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      ...transformProjectData(entry.data),
      accountId: toNumber(entry.data.account_id),
      amount: entry.data.amount,
      appendedDescr: entry.data.appended_descr,
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      projectId: entry.data.project_id,
      shortDescr: entry.data.shortDescr,
      transId:
        entry.data.transId === null || entry.data.transId === false
          ? null
          : toNumber(entry.data.transId),
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      username: entry.data.userName,
      // newMilestone might be undefined for some reasons.
      isInitialPayment: !!entry.data.newMilestone?.is_initial_payment,
    },
  };
}

export function transformDeniedApiEntry(
  entry: WebsocketDeniedEvent,
  userId: string,
): (TimeMilliseconds & NotificationDenied) | NewsFeedApiEntrySkipped {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      id: toNumber(entry.data.id),
      imgUrl: entry.data.imgUrl,
      jobsUrl: entry.data.jobsURL,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      projectType: entry.data.projectType,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      userId: entry.data.userId,
      username: entry.data.userName,
      ...(entry.data.autoRepostProjectId && {
        autoRepostProjectId: toNumber(entry.data.autoRepostProjectId),
      }),
    },
  };
}

export function transformDraftContestApiEntry(
  entry: WebsocketDraftContestEvent,
  userId: string,
): TimeMilliseconds & NotificationDraftContest {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    // TODO: This breaks pagination as we get less entries than we asked the API for
    id: `${userId}:draftContest:${entry.data.contestId}`,
    time: entry.timestamp * 1000,
    data: {
      contestEditUrl: entry.data.contestEditUrl,
      contestId: entry.data.contestId,
      contestName: entry.data.contestName,
      imgUrl: entry.data.imgUrl,
      isPublished: entry.data.isPublished,
      linkUrl: entry.data.contestUrl,
    },
  };
}

export function transformEscalateDisputeApiEntry(
  entry: WebsocketEscalateDisputeEvent,
): TimeMilliseconds & NotificationEscalateDispute {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      disputeId: entry.data.dispute_id,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      time: entry.data.time * 1000,
      username: entry.data.userName,
    },
  };
}

export function transformHireMeApiEntry(
  entry: WebsocketHireMeEvent,
): (TimeMilliseconds & NotificationHireMe) | NewsFeedApiEntrySkipped {
  if (!entry.state && !entry.data.acceptByTime) {
    return newsfeedApiEntrySkipped(entry);
  }
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      acceptByTime: entry.data.acceptByTime
        ? entry.data.acceptByTime * 1000
        : undefined,
      appendedDescr: entry.data.appended_descr,
      currency: {
        code: entry.data.currencyCode,
        sign: entry.data.currencySign,
      },
      id: toNumber(entry.data.id),
      imgUrl: entry.data.imgUrl,
      jobString: entry.data.jobString,
      linkUrl: entry.data.linkUrl,
      period: toNumber(entry.data.period),
      projIsHourly: entry.data.projIsHourly,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      state: entry.state,
      sum: toNumber(entry.data.sum),
      title: entry.data.title,
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformInviteToContestApiEntry(
  entry: WebsocketInviteToContestEvent,
): TimeMilliseconds & NotificationInviteToContest {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      buyer: entry.data.buyer,
      buyerName: entry.data.buyerName,
      buyerPublicName: userDisplayName(
        entry.data.buyerName,
        entry.data.buyerPublicName,
      ),
      buyerUrl: entry.data.buyerUrl,
      contestRecommendedSkills: entry.data.contest_recommended_skills,
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      description: entry.data.description,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      prize: toNumber(entry.data.prize),
      sellerId: entry.data.sellerId,
      sellerName: entry.data.sellerName,
      sellerPublicName: userDisplayName(
        entry.data.sellerName,
        entry.data.sellerPublicName,
      ),
      title: entry.data.title,
      type: entry.data.type || undefined,
    },
  };
}

export function transformInviteUserBidApiEntry(
  entry: WebsocketInviteUserBidEvent,
): TimeMilliseconds & NotificationInviteUserBid {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      ...transformProjectData(entry.data),
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      inviteeId: toNumber(entry.data.inviteeId),
      inviteeName: entry.data.inviteeName,
      maxBudget: toNumber(entry.data.maxBudget),
      minBudget: toNumber(entry.data.minBudget),
      projIsHourly: entry.data.projIsHourly,
      publicName: userDisplayName(
        entry.data.inviteeName,
        entry.data.publicName,
      ),
    },
  };
}

export function transformInvoiceFeedbackApiEntry(
  entry: WebsocketInvoiceFeedbackEvent,
): TimeMilliseconds & NotificationInvoiceFeedback {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      freelancerId: toNumber(entry.data.accountId),
      imgUrl: undefined,
      invoiceId: entry.data.invoiceId
        ? toNumber(entry.data.invoiceId)
        : undefined,
      projectId: toNumber(entry.data.id),
      projectName: entry.data.name,
      seoUrl: entry.data.seoUrl,
    },
  };
}

export function transformInvoiceRequestedApiEntry(
  entry: WebsocketInvoiceRequestedEvent,
): TimeMilliseconds & NotificationInvoiceRequested {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: toNumber(entry.data.accountId),
      amount: toNumber(entry.data.amount),
      bidId: toNumber(entry.data.bidId),
      currencyCode: entry.data.currencyCode,
      currencySign: entry.data.currencySign,
      imgUrl: entry.data.imgUrl,
      invoiceId: toNumber(entry.data.invoiceId),
      linkUrl: `${entry.data.linkUrl}#invoices_${entry.data.bidId}`,
      name: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      sellerId: toNumber(entry.data.sellerId),
      seoUrl: entry.data.seoUrl,
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
    },
  };
}

export function transformInvoiceRequestedChangeApiEntry(
  entry: WebsocketInvoiceRequestedChangeEvent,
): TimeMilliseconds & NotificationInvoiceRequestChange {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      amount: toNumber(entry.data.amount),
      bidId: toNumber(entry.data.bidId),
      currencyCode: entry.data.currencyCode,
      imgUrl: entry.data.img ? entry.data.img.profile_logo_url : undefined,
      name: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl,
      username: entry.data.userName,
    },
  };
}

export function transformInvoicePaidApiEntry(
  entry: WebsocketInvoicePaidEvent,
): TimeMilliseconds & NotificationInvoicePaid {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      currency: {
        code: entry.data.currencyCode,
        sign: entry.data.currencySign,
      },
      amount: toNumber(entry.data.amount),
      imgUrl: entry.data.img.profile_logo_url,
      invoiceId: toNumber(entry.data.invoiceId),
      projectId: toNumber(entry.data.id),
      projectName: entry.data.name,
      username: entry.data.userName,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl,
    },
  };
}

export function transformMakeDisputeOfferApiEntry(
  entry: WebsocketMakeDisputeOfferEvent,
): TimeMilliseconds & NotificationMakeDisputeOffer {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      amount: toNumber(entry.data.amount),
      currency: {
        code: entry.data.currency.code,
        sign: entry.data.currency.sign,
      },
      disputeId: entry.data.dispute_id,
      projectId: entry.data.id,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      senderRole: entry.data.sender_role,
      username: entry.data.userName,
    },
  };
}

export function transformNewDisputeApiEntry(
  entry: WebsocketNewDisputeEvent,
): TimeMilliseconds & NotificationNewDispute {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: entry.data.accountId,
      disputeId: entry.data.dispute_id,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      projectId: entry.data.id,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      reason: entry.data.reason ? entry.data.reason : undefined,
      time: entry.data.time * 1000,
      username: entry.data.userName,
    },
  };
}

export function transformReviewActivateApiEntry(
  entry: WebsocketReviewActivateEvent,
): TimeMilliseconds & NotificationReviewActivate {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      currencyId: toNumber(entry.data.currencyId),
      id: entry.data.id,
      imgUrl: undefined,
      isAutomaticPayments: entry.data.isAutomaticPayments,
      isHourly: entry.data.isHourly,
      isMilestoneCreated: entry.data.isMilestoneCreated,
      isQHP: entry.data.isQHP ? entry.data.isQHP : false,
      name: entry.data.name,
      notShowEmployerFee:
        entry.data.notShowEmployerFee === null
          ? false
          : entry.data.notShowEmployerFee,
      projectCreateType: entry.data.projectCreateType,
      quickhireFreelancerId: entry.data.quickhireFreelancerId
        ? toNumber(entry.data.quickhireFreelancerId)
        : null,
      quickhireFreelancerPublicName: entry.data.quickhireFreelancerUsername
        ? userDisplayName(
            entry.data.quickhireFreelancerUsername,
            entry.data.quickhireFreelancerPublicName,
          )
        : entry.data.quickhireFreelancerPublicName,
      quickhireFreelancerUsername: entry.data.quickhireFreelancerUsername,
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
    },
  };
}

export function transformRevokedApiEntry(
  entry: WebsocketRevokedEvent,
): TimeMilliseconds & NotificationRevoke {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      project: {
        id: entry.data.apiMessage.project.id,
        ownerId: entry.data.apiMessage.project.owner_id,
        title: entry.data.apiMessage.project.title,
        seoUrl: entry.data.apiMessage.project.seo_url,
        hireme: entry.data.apiMessage.project.hireme,
      },
      bid: {
        id: entry.data.apiMessage.bid.id,
        bidderId: entry.data.apiMessage.bid.id,
        awardStatus: entry.data.apiMessage.bid.award_status,
      },
      awardeeId: entry.data.awardeeId,
      imgUrl: entry.data.imgUrl,
    },
  };
}

export function transformPendingFundsApiEntry(
  entry: WebsocketPendingFundsEvent,
): TimeMilliseconds & NotificationPendingFunds {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      message: entry.data.message,
      reason: entry.data.reason,
      descr: parseStringWithLinks(entry.data.descr),
      amount: toNumber(entry.data.amount),
      currency: {
        code: entry.data.currencycode,
        sign: entry.data.currencysign,
      },
    },
  };
}

export function transformProjectCompletedApiEntry(
  entry: WebsocketProjectCompletedEvent,
  userId: string,
): TimeMilliseconds & NotificationProjectCompleted {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      projectId: toNumber(entry.data.id),
      amount: toNumber(entry.data.amount),
      categoryName: entry.data.categoryName,
      completeStatus: entry.data.completeStatus,
      currencyCode: entry.data.currencycode,
      currencyId: toNumber(entry.data.currencyid),
      currencySign: entry.data.currencysign,
      employerId: toNumber(entry.data.employerId),
      employerPublicName: userDisplayName(
        entry.data.employerUsername,
        entry.data.employerPublicName,
      ),
      employerUsername: entry.data.employerUsername,
      expiredTimestamp: entry.data.expiredTimestamp
        ? toNumber(entry.data.expiredTimestamp) * 1000
        : undefined,
      freelancerId: toNumber(entry.data.freelancerId),
      freelancerPublicName: userDisplayName(
        entry.data.freelancerUsername,
        entry.data.freelancerPublicName,
      ),
      freelancerUsername: entry.data.freelancerUsername,
      imgUrl: undefined,
      name: entry.data.name,
      // projIsHourly: entry.data.projIsHourly,
      selectionId: toNumber(entry.data.selectionId),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      state: entry.data.state ? entry.data.state : entry.state,
      submitDate: entry.data.submitDate,
      linkUrl: `/users/review/rate.php?id=${entry.data.id}&to_user=${
        toNumber(entry.data.employerId) === toNumber(userId)
          ? entry.data.freelancerId
          : entry.data.employerId
      }`,
      bidId: toNumber(entry.data.bidId),
    },
  };
}

export function transformProjectEmailVerificationRequiredApiEntry(
  entry: WebsocketProjectEmailVerificationRequiredEvent,
): TimeMilliseconds & NotificationProjectEmailVerificationRequired {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: `${entry.data.userId}:projectEmailVerificationRequiredEvent:${entry.data.userId}`,
    time: entry.timestamp * 1000,
    data: {
      imgUrl: undefined,
      userId: entry.data.userId,
      projectId: entry.data.projectId,
    },
  };
}

export function transformProjectHireMeExpiredApiEntry(
  entry: WebsocketProjectHireMeExpiredEvent,
): TimeMilliseconds & NotificationProjectHireMeExpired {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      autoRepostProjectId: entry.data.autoRepostProjectId,
      autoRepostProjectName: entry.data.autoRepostProjectName,
      // Auto re-posted projects use the default logo
      imgUrl: entry.data.autoRepostProjectId
        ? undefined
        : entry.data.img.profile_logo_url,
      jobsUrl: entry.data.jobsURL,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      projectId: entry.data.id,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl,
      userId: entry.data.userId,
      username: entry.data.userName,
    },
  };
}

export function transformRequestEndProjectApiEntry(
  entry: WebsocketRequestEndProjectEvent,
): TimeMilliseconds & NotificationRequestEndProject {
  // The project link could be corrupt, if it is create a new one using the project id.
  const linkUrl =
    entry.data.linkUrl.indexOf('/projects/.html') >= 0
      ? `/projects/${entry.data.id}.html`
      : entry.data.linkUrl;

  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      id: toNumber(entry.data.id),
      dayCount: entry.data.dayCount,
      imgUrl: entry.data.imgUrl,
      linkUrl: undefined,
      link: transformLinkUrl(linkUrl),
      username: entry.data.userName,
      name: entry.data.name,
      userId: entry.data.userId,
      submitDate: entry.data.submitDate,
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      accountId: entry.data.accountId,
      bidId: entry.data.bidId,
      categoryName: entry.data.categoryName,
    },
  };
}

export function transformReleaseMilestoneApiEntry(
  entry: WebsocketReleaseMilestoneEvent,
): TimeMilliseconds & NotificationReleaseMilestone {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: entry.data.accountId,
      amount: entry.data.amount,
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      otherReason: entry.data.otherReason,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      submitDate: entry.data.submitDate,
      title: entry.data.title,
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
    },
  };
}

export function transformReleasePartMilestoneApiEntry(
  entry: WebsocketReleasePartMilestoneEvent,
): TimeMilliseconds & NotificationReleasePartMilestone {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: entry.data.accountId,
      amount: toNumber(entry.data.amount),
      bidId: entry.data.bidId,
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      id: entry.data.id,
      imgUrl: entry.data.img ? entry.data.img.profile_logo_url : undefined,
      leftAmount: entry.data.leftAmount,
      linkUrl: entry.data.linkUrl,
      name: entry.data.name,
      otherReason: entry.data.otherReason,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      tranId: entry.data.tranId,
      userName: entry.data.userName,
    },
  };
}

export function transformReviewPostedNewApiEntry(
  entry: WebsocketReviewPostedEvent,
): TimeMilliseconds & NotificationReviewPostedNew {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    // De-duplicate reviews in the newsfeed per project and per giving user
    // TODO: This breaks pagination as we get less entries than we asked the API for
    id: `${entry.type}-${entry.data.id}-${entry.data.userId}`,
    time: entry.timestamp * 1000,
    data: {
      imgUrl: entry.data.img.profile_logo_url,
      projectId: toNumber(entry.data.id),
      invoiceId: toNumber(entry.data.invoice_id),
      projectName: entry.data.name,
      isHourlyProject: entry.data.projIsHourly,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      state: entry.state,
      username: entry.data.userName,
      userId: entry.data.userId,
    },
  };
}

export function transformUpgradeToNonFreeMembershipApiEntry(
  entry: WebsocketUpgradeToNonFreeMembershipEvent,
): TimeMilliseconds & NotificationUpgradeToNonFreeMembership {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      currencyCode: entry.data.currencyCode,
      currentPlan: entry.data.currentPlan,
      freeTrial: entry.data.freeTrial,
      imgUrl: undefined,
      newPlan: entry.data.newPlan,
      price: entry.data.price ? toNumber(entry.data.price) : null,
      refundedAmount: entry.data.refundedAmount
        ? toNumber(entry.data.refundedAmount)
        : null,
      start: entry.data.start,
      end: entry.data.end,
      tax: entry.data.tax,
      timeUnit: entry.data.timeUnit,
      type: entry.data.type,
    },
  };
}

export function transformRequestMilestoneApiEntry(
  entry: WebsocketRequestMilestoneEvent,
): TimeMilliseconds & NotificationRequestMilestone {
  const linkUrl = !entry.data.linkUrl
    ? `/projects/${entry.data.seoUrl}.html`
    : `${entry.data.linkUrl}#invoices_${entry.data.bidId}`;

  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: toNumber(entry.data.accountId),
      amount: toNumber(entry.data.amount),
      bidId: toNumber(entry.data.bidId),
      currencyCode: entry.data.currencyCode,
      currencyId: toNumber(entry.data.currencyId),
      currencySign: entry.data.currencySign,
      description: entry.data.description,
      id: toNumber(entry.data.id),
      imgUrl: entry.data.imgUrl,
      linkUrl,
      name: entry.data.name,
      requestId: toNumber(entry.data.requestId),
      sellerId: toNumber(entry.data.sellerId),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      submitDate: entry.data.submitDate,
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
    },
  };
}

export function transformRequestToReleaseApiEntry(
  entry: WebsocketRequestToReleaseEvent,
): TimeMilliseconds & NotificationRequestToRelease {
  const linkUrl = !entry.data.linkUrl
    ? `/projects/${entry.data.seoUrl}.html`
    : `${entry.data.linkUrl}#invoices_${entry.data.bidId}`;

  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: toNumber(entry.data.accountId),
      amount: toNumber(entry.data.amount),
      bidId: toNumber(entry.data.bidId),
      currencyCode: entry.data.currencycode,
      currencySign: entry.data.currencysign,
      descr: entry.data.descr,
      // img: ???,
      imgUrl: entry.data.imgUrl,
      linkUrl,
      name: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      seoUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      state: entry.data.state,
      tranId: toNumber(entry.data.tranId),
      userId: toNumber(entry.data.userId),
      username: entry.data.userName,
    },
  };
}

export function transformSendDisputeMessageApiEntry(
  entry: WebsocketSendDisputeMessageEvent,
): TimeMilliseconds & NotificationSendDisputeMessage {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      disputeId: entry.data.dispute_id,
      projectId: entry.data.id,
      imgUrl: entry.data.imgUrl,
      linkUrl: entry.data.linkUrl,
      message: entry.data.message,
      projectName: entry.data.name,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      username: entry.data.userName,
      userId: entry.data.userId,
    },
  };
}

export function transformUpdateMilestoneApiEntry(
  entry: WebsocketUpdateMilestoneEvent,
): (TimeMilliseconds & NotificationUpdateMilestone) | NewsFeedApiEntrySkipped {
  // Ignore non-selected sellers
  if (!entry.data.isSelected) {
    return newsfeedApiEntrySkipped(entry);
  }

  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      accountId: entry.data.accountId,
      amount: entry.data.amount,
      bidId: entry.data.bidId,
      currencyCode: entry.data.currencyCode,
      currencySign: entry.data.currencySign,
      description: entry.data.description,
      imgUrl:
        entry.data.img && typeof entry.data.img.logo_url === 'string'
          ? entry.data.img.logo_url
          : undefined,
      isSelected: entry.data.isSelected,
      linkUrl: entry.data.seoUrl
        ? entry.data.seoUrl.toString()
        : entry.data.id.toString(),
      name: entry.data.name,
      oldAmount: entry.data.old_amount,
      publicName: userDisplayName(entry.data.userName, entry.data.publicName),
      requestId: entry.data.requestId,
      sellerId: toNumber(entry.data.sellerId),
      username: entry.data.userName,
      id: entry.data.id,
    },
  };
}

export function transformUpsellPlusTrialApiEntry(
  entry: WebsocketUpsellPlusTrialEvent,
): (TimeMilliseconds & NotificationUpsellPlusTrial) | NewsFeedApiEntrySkipped {
  // Ignore invalid/old entry items.
  if (
    (!entry.data.isBoth && !entry.data.isFreelancer) ||
    !entry.data.trialPackage
  ) {
    return newsfeedApiEntrySkipped(entry);
  }

  // Since pkg and package are both optional fields of entry.data we must
  // validate and ignore this event if it would be invalid. It should not
  // ever be the case in production though (legacy renaming of pkg)
  const packageUpperName = entry.data.trialPackage.package
    ? entry.data.trialPackage.package.upper_name
    : entry.data.trialPackage.pkg
    ? entry.data.trialPackage.pkg.upper_name
    : undefined;
  if (!packageUpperName) {
    return newsfeedApiEntrySkipped(entry);
  }

  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      currencyCode: entry.data.currency_code,
      currencySign: entry.data.currency_sign,
      extendPrice: entry.data.extendPrice,
      isBoth: entry.data.isBoth,
      isEmployer: entry.data.isEmployer,
      isFreelancer: entry.data.isFreelancer,
      price: entry.data.price,
      taxName:
        entry.data.withTax && entry.data.taxName
          ? entry.data.taxName
          : entry.data.with_GST
          ? 'GST'
          : undefined,
      benefits: {
        bidsLimit: {
          benefitValue: entry.data.trialBenefits.bids_limit.benefit_value,
        },
        offsiteInvoice: {
          benefitValue: entry.data.trialBenefits.offsite_invoice.benefit_value,
        },
        skillsLimit: {
          benefitValue: entry.data.trialBenefits.skills_limit.benefit_value,
        },
      },
      trialPackage: {
        packageId: entry.data.trialPackage.package_id,
        package: {
          upperName: packageUpperName,
        },
      },
      trialPrice: entry.data.trialPrice,
    },
  };
}

export function transformShowcaseSourceApproval(
  entry: WebsocketShowcaseSourceApprovalEvent,
): TimeMilliseconds & NotificationShowcaseSourceApproval {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      imgUrl: undefined,
      linkUrl: entry.data.linkUrl,
      projectId: entry.data.projectId,
      projectTitle: entry.data.projectTitle,
      projectType: entry.data.projectType,
    },
  };
}

export function transformSubmitOnBehalfProject(
  entry: WebsocketSubmitOnBehalfProjectEvent,
): TimeMilliseconds & NotificationSubmitOnBehalfProject {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      onBehalfProjectId: entry.data.onBehalfProjectId,
      projectTitle: entry.data.projectTitle,
      posterId: entry.data.posterId,
      posterDisplayName: entry.data.posterDisplayName,
      posterUsername: entry.data.posterUsername,
      nominatedEmail: entry.data.nominatedEmail,
      nominatedUserDisplayName: entry.data.nominatedUserDisplayName,
      nominatedUserUsername: entry.data.nominatedUserUsername,
      imgUrl: entry.data.imgUrl,
    },
  };
}

export function transformPostOnBehalfProject(
  entry: WebsocketPostOnBehalfProjectEvent,
): TimeMilliseconds & NotificationPostOnBehalfProject {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: entry.data,
  };
}

export function transformRejectOnBehalfProject(
  entry: WebsocketRejectOnBehalfProjectEvent,
): TimeMilliseconds & NotificationRejectOnBehalfProject {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: entry.data,
  };
}

export function transformUserReportsActionBidRestrictionApiEntry(
  entry: WebsocketUserReportsActionBidRestrictionEvent,
): TimeMilliseconds & NotificationUserReportsActionBidRestriction {
  return {
    type: entry.type,
    parent_type: entry.parent_type,
    id: entry.id,
    time: entry.timestamp * 1000,
    data: {
      imgUrl: undefined,
      id: entry.data.id,
      action: entry.data.action,
      startDate: entry.data.startDate * 1000,
      endDate: entry.data.endDate * 1000,
    },
  };
}

export function transformNewsfeed(
  entry: NewsfeedApiEntry,
  userId: string,
): NewsfeedEntry | NewsFeedApiEntrySkipped {
  if (isTestEntry(entry)) {
    return newsfeedApiEntrySkipped(entry);
  }

  switch (entry.type) {
    // Unsupported newsfeed events
    case 'aborted':
    case 'adminWarningUserBidRestriction':
    case 'awardBadge':
    case 'awardCredit':
    case 'awardMilestoneReminder':
    case 'awardReminder':
    case 'awardXp':
    case 'banUserFromBidding':
    case 'bid_self':
    case 'bid_updated':
    case 'bidHidden': // TODO: T38861 bidHidden in A/B test & not implemented
    case 'bidsRunningOut':
    case 'buyFreeMarketService':
    case 'collaboratorAddedViaChat':
    case 'collaboratorsUpdatedRefreshChat':
    case 'communityPromoNoti':
    case 'contactRequestReceived':
    case 'contactRequestSent':
    case 'contactsAutoAddedReceiver':
    case 'contactsAutoAddedSender':
    case 'contest':
    case 'contestCompleteSellEntryUpsell':
    case 'contestEntry':
    case 'contestEntryBoughtToEmployer':
    case 'contestEntryBoughtToFreelancer':
    case 'contestEntryCommentedToFreelancer':
    case 'contestEntryRatedToFreelancer':
    case 'contestEntryReconsideredToFreelancer':
    case 'contestEntryRejectedToFreelancer':
    case 'contestLockedEmployer':
    case 'contestLockedFreelancer':
    case 'contestPCBNotification':
    case 'contestPCBNotificationFullView':
    case 'contestUpsellFeaturedUpgrade':
    case 'counterOffer':
    case 'deleteFile':
    case 'downgradeToFreeMembershipNoti':
    case 'draftContestRealtime':
    case 'editAwardedBidDeclined':
    case 'editAwardedBidRequest':
    case 'employerWelcome':
    case 'examPassedUpsell':
    case 'examRetakingDiscount':
    case 'expertsPromoNoti':
    case 'failingProject':
    case 'firstEarning':
    case 'freeMarketServiceExpired':
    case 'freeMarketServiceIsExpired':
    case 'generic':
    case 'giveGetChildPartialMilestoneRelease':
    case 'giveGetChildReceivedSignupBonus':
    case 'giveGetChildSignUp':
    case 'giveGetParentBonus':
    case 'highLtvAnnualDiscount':
    case 'hostingRequest':
    case 'hostingShare':
    case 'inviteFriends':
    case 'invoiceAcceptedPartial':
    case 'invoicePartialPaid':
    case 'levelUp':
    case 'localJobPosted':
    case 'localJobsActivation':
    case 'negotiatedProjectStatusChange':
    case 'notifyfollower':
    case 'pmb':
    case 'pmb_public':
    case 'prehireProjectCreated':
    case 'project':
    case 'projectStatusChange':
    case 'promoteContest':
    case 'quickHireProject':
    case 'recruiterProject':
    case 'removeUserFromDirectory':
    case 'reviewPending':
    case 'reviewposted':
    case 'secondBidPlusTrialUpsell':
    case 'sellFreeMarketService':
    case 'serviceApproved':
    case 'serviceLimitReached':
    case 'serviceProjectEndedBuyer':
    case 'serviceProjectEndedSeller':
    case 'serviceProjectEndingSeller':
    case 'serviceProjectPostedBuyer':
    case 'serviceProjectPostedSeller':
    case 'serviceRejected':
    case 'serviceSellerPromotion':
    case 'serviceStatusChanged':
    case 'serviceSubmitted':
    case 'showcasePromoNoti':
    case 'signUpFreeTrialUpsell':
    case 'sitesBidCreated':
    case 'sitesBinCreated':
    case 'sitesHandOverMessageSent':
    case 'sitesListingStatusChanged':
    case 'sitesMessageSent':
    case 'sitesOfferCreated':
    case 'specialLoyaltyDiscount':
    case 'sponsor_bid':
    case 'supportGetHelpNewsfeed':
    case 'tasklist_create': // Renamed to tasklistCreateV1
    case 'tasklistCreateV1':
    case 'tombstoneNoti':
    case 'tombstoneNotiEmployer':
    case 'tombstoneNotiFreelancer':
    case 'upsellAssistedUpgrade':
    case 'upsellCrowdsourceFinding':
    case 'upsellFeatureUpgrade':
    case 'upsellIntro':
    case 'userSideAction':
    case 'userSideActionFeedback':
    case 'xpContest':
    case 'yahooMailAlert':
      return newsfeedApiEntrySkipped(entry);

    // Supported newsfeed events
    case 'acceptDisputeOffer':
      return transformAcceptDisputeOfferApiEntry(entry);
    case 'adminForceVarifyPhone':
      return transformAdminForceVerifyPhoneApiEntry(entry);
    case 'articleCommentReceived':
      return transformArticleCommentApiEntry(entry);
    case 'award':
      return transformAwardApiEntry(entry, userId);
    case 'bid':
      return transformBidApiEntry(entry, userId);
    case 'completed':
      return transformProjectCompletedApiEntry(entry, userId);
    case 'contestAwardedToEmployer':
      return transformContestAwardedToEmployerApiEntry(entry);
    case 'contestAwardedToFreelancer':
      return transformContestAwardedToFreelancerApiEntry(entry);
    case 'createMilestone':
      // Do not show events to project owners.
      if (
        entry.data.newMilestone &&
        entry.data.newMilestone.project_owner_id !== userId
      ) {
        return transformCreateMilestoneApiEntry(entry);
      }
      return newsfeedApiEntrySkipped(entry);
    case 'completeReview':
      return transformCompleteReviewApiEntry(entry);
    case 'denyed':
      return transformDeniedApiEntry(entry, userId);
    case 'draftContest':
      return transformDraftContestApiEntry(entry, userId);
    case 'escalateDispute':
      return transformEscalateDisputeApiEntry(entry);
    case 'hireMe':
      return transformHireMeApiEntry(entry);
    case 'makeDisputeOffer':
      return transformMakeDisputeOfferApiEntry(entry);
    case 'inviteToContest':
      return transformInviteToContestApiEntry(entry);
    case 'inviteUserBid':
      return transformInviteUserBidApiEntry(entry);
    case 'invoiceFeedback':
      return transformInvoiceFeedbackApiEntry(entry);
    case 'invoiceRequested':
      return transformInvoiceRequestedApiEntry(entry);
    case 'invoiceRequestChange':
      return transformInvoiceRequestedChangeApiEntry(entry);
    case 'invoicePaid':
      return transformInvoicePaidApiEntry(entry);
    case 'newDispute':
      return transformNewDisputeApiEntry(entry);
    case 'pendingFunds':
      return transformPendingFundsApiEntry(entry);
    case 'postOnBehalfProject':
      return transformPostOnBehalfProject(entry);
    case 'projectEmailVerificationRequiredEvent':
      return transformProjectEmailVerificationRequiredApiEntry(entry);
    case 'projectHireMeExpired':
      return transformProjectHireMeExpiredApiEntry(entry);
    case 'rejectOnBehalfProject':
      return transformRejectOnBehalfProject(entry);
    case 'requestEndProject':
      return transformRequestEndProjectApiEntry(entry);
    case 'reviewActivate':
      return transformReviewActivateApiEntry(entry);
    case 'releaseMilestone':
      return transformReleaseMilestoneApiEntry(entry);
    case 'requestMilestone':
      return transformRequestMilestoneApiEntry(entry);
    case 'requestToRelease':
      return transformRequestToReleaseApiEntry(entry);
    case 'releasePartMilestone':
      return transformReleasePartMilestoneApiEntry(entry);
    case 'reviewpostednew':
      return transformReviewPostedNewApiEntry(entry);
    case 'revoked':
      return transformRevokedApiEntry(entry);
    case 'sendDisputeMessage':
      return transformSendDisputeMessageApiEntry(entry);
    case 'showcaseSourceApproval':
      return transformShowcaseSourceApproval(entry);
    case 'submitOnBehalfProject':
      return transformSubmitOnBehalfProject(entry);
    case 'updateMilestone':
      return transformUpdateMilestoneApiEntry(entry);
    case 'upsellPlusTrial':
      return transformUpsellPlusTrialApiEntry(entry);
    case 'upgradeToNonFreeMembership':
      return transformUpgradeToNonFreeMembershipApiEntry(entry);
    case 'userReportsActionBidRestriction':
      return transformUserReportsActionBidRestrictionApiEntry(entry);
    case 'accepted':
      return transformAcceptedApiEntry(entry);
    case 'activateFreelancer':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          id: entry.data.id,
          imgUrl: undefined,
          key: entry.data.key,
          updatedProfile: entry.data.updatedProfile === 'true',
          verifiedEmail: entry.data.verifiedEmail === 'true',
        },
      };
    case 'completeContestReview':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          userId: entry.data.userId,
          username: entry.data.userName,
          projectName: entry.data.name,
          publicName: userDisplayName(
            entry.data.userName,
            entry.data.publicName,
          ),
          message: entry.data.message,
          rating: entry.data.rating,
          imgUrl:
            entry.data.img && typeof entry.data.img.logo_url === 'string'
              ? entry.data.img.logo_url
              : undefined,
          seoUrl: entry.data.seoUrl,
        },
      };
    case 'contest_pcb':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        // TODO: This breaks pagination as we get less entries than we asked the API for
        id: `${userId}:contest_pcb:${entry.data.contestId}`,
        time: entry.timestamp * 1000,
        data: {
          messagesOverWs: 0,
          imgUrl: entry.data.imgUrl,
          contestId: toNumber(entry.data.contestId),
          contestSeoUrl: entry.data.seoUrl,
          contestName: entry.data.contestName,
          publicName: userDisplayName(
            entry.data.username,
            entry.data.userPublicName,
          ),
          username: entry.data.username,
        },
      };
    case 'contestComplete':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestName: entry.data.contest_name,
          contestUrl: entry.data.contest_url,
          imgUrl: entry.data.imgUrl,
          publicName: userDisplayName(
            entry.data.user_name,
            entry.data.public_name,
          ),
          reviewId: toNumber(entry.data.review_id),
          toFreelancer: entry.data.to_freelancer,
          username: entry.data.user_name,
          entryId: toNumber(entry.data.entry_id),
        },
      };
    case 'contestCreated':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        // Fix for ordering when draftContest
        // has the same timestamp
        time: entry.timestamp * 1000 + 1,
        data: {
          contestId: entry.data.contest_id,
          contestName: entry.data.contest_name,
          contestUrl: entry.data.contest_url,
        },
      };
    case 'contestEntryCreated':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        // TODO: This breaks pagination as we get less entries than we asked the API for
        id: `${userId}:contestEntryCreated:${entry.data.contestId}`,
        time: entry.timestamp * 1000,
        data: {
          entriesList: [],
          imgUrl:
            entry.data.freelancerImg &&
            typeof entry.data.freelancerImg.logo_url === 'string'
              ? entry.data.freelancerImg.logo_url
              : undefined,
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          contestSeoUrl: entry.data.contestSeoUrl,
          entryId: toNumber(entry.data.entryId),
          entryNumber: toNumber(entry.data.entryNumber),
          entryThumb: entry.data.entryThumb,
          entryUrl: entry.data.entryUrl,
          freelancerId: toNumber(entry.data.userId),
          freelancerUsername: entry.data.freelancerName,
          freelancerPublicName: userDisplayName(
            entry.data.freelancerName,
            entry.data.freelancerPublicName,
          ),
          time: entry.data.time * 1000,
        },
      };
    case 'contestEntryRated':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        // TODO: This breaks pagination as we get less entries than we asked the API for
        id: `${userId}:contestEntryRated:${entry.data.contestId}`,
        time: entry.timestamp * 1000,
        data: {
          entriesList: [], // To store WebSocket events
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          contestSeoUrl: entry.data.contestSeoUrl,
          employerPublicName: userDisplayName(
            entry.data.employerName,
            entry.data.employerPublicName,
          ),
          employerUsername: entry.data.employerName,
          entryId: toNumber(entry.data.entryId),
          entryNumber: entry.data.entryNumber,
          entryThumb: entry.data.entryThumb,
          entryUrl: entry.data.entryUrl,
          imgUrl:
            entry.data.employerImg &&
            typeof entry.data.employerImg.logo_url === 'string'
              ? entry.data.employerImg.logo_url
              : undefined,
          rating: toNumber(entry.data.rating),
          time: entry.data.time * 1000,
        },
      };
    case 'contestExpired':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestEndDate: entry.data.contest_end_date * 1000,
          contestName: entry.data.contest_name,
          contestSeoUrl: entry.data.contest_url,
          isExtended:
            typeof entry.data.isExtended === 'boolean'
              ? entry.data.isExtended
              : toNumber(entry.data.isExtended) === 1,
        },
      };
    case 'contestreviewposted':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestId: toNumber(entry.data.id),
          contestName: entry.data.name,
          contestSeoUrl: entry.data.seoUrl,
          imgUrl:
            entry.data.img && typeof entry.data.img.logo_url === 'string'
              ? entry.data.img.logo_url
              : undefined,
          publicName: userDisplayName(
            entry.data.userName,
            entry.data.publicName,
          ),
          state: entry.state,
          userId: toNumber(entry.data.userId),
          username: entry.data.userName,
        },
      };
    case 'customAdminNotification':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          description: entry.data.noti_description,
          id: entry.data.id,
          imgUrl: undefined,
          linkText: entry.data.link_text,
          linkUrl: entry.data.link_url,
          text: entry.data.noti_text,
        },
      };
    case 'directTransferDone':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: entry.data.img ? entry.data.img.profile_logo_url : undefined,
          id: entry.data.id,
          userId: entry.data.userId,
          publicName: userDisplayName(
            entry.data.userName,
            entry.data.publicName,
          ),
          seoUrl: entry.data.seoUrl ? entry.data.seoUrl.toString() : entry.id,
          name: entry.data.name,
          amount: entry.data.amount,
          currencyCode: entry.data.currencycode,
          otherReason: entry.data.otherReason,
          userName: entry.data.userName,
        },
      };
    case 'editAwardedBidAccepted':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          id: entry.data.id,
          imgUrl: entry.data.img.profile_logo_url,
          currencyCode: entry.data.currencyCode,
          buyerName: entry.data.buyerName,
          buyerPublicName: userDisplayName(
            entry.data.buyerName,
            entry.data.buyerPublicName,
          ),
          editBidDetails: {
            newAmount: entry.data.editBidDetails.newAmount,
            newPeriod: entry.data.editBidDetails.newPeriod,
          },
          projName: entry.data.projName,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'emailChange':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          requestId: entry.data.requestId,
          newEmail: entry.data.new_email,
        },
      };
    case 'invoiceWithdrawn':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          amount: toNumber(entry.data.amount),
          currencyCode: entry.data.currencyCode,
          imgUrl: entry.data.img.profile_logo_url,
          name: entry.data.name,
          publicName: userDisplayName(
            entry.data.userName,
            entry.data.publicName,
          ),
          seoUrl: entry.data.seoUrl,
          username: entry.data.userName,
        },
      };
    case 'kyc':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          country: entry.data.country,
          imgUrl: undefined,
          isCorporate: entry.data.isCorporate === 'true',
          status: entry.data.status,
        },
      };
    case 'postDraftProject':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          projectId: entry.data.projectId,
          projectName: entry.data.projectName,
        },
      };
    case 'prizeDispersedEmployer':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestName: entry.data.contest_name,
          contestSeoUrl: entry.data.contest_url,
          freelancerPublicName: entry.data.freelancer_username
            ? userDisplayName(
                entry.data.freelancer_username,
                entry.data.freelancer_publicname,
              )
            : entry.data.freelancer_publicname,
          freelancerUsername: entry.data.freelancer_username,
          hasWinner: entry.data.hasWinner,
        },
      };
    case 'prizeDispersedFreelancer':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestName: entry.data.contest_name,
          contestSeoUrl: entry.data.contest_url,
        },
      };
    case 'projectSharedWithYou':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          actingInviterPublicName:
            (entry.data.actingInviterUsername &&
              userDisplayName(
                entry.data.actingInviterUsername,
                entry.data.actingInviterPublicName,
              )) ||
            undefined,
          actingInviterUsername: entry.data.actingInviterUsername || undefined,
          employerPublicName: userDisplayName(
            entry.data.employerUsername,
            entry.data.employerPublicName,
          ),
          employerUsername: entry.data.employerUsername,
          imgUrl: undefined,
          projectId: entry.data.projectId,
          projectName: entry.data.projectName,
        },
      };
    case 'rejected':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          rejectReasons: entry.data.rejectReasonConfig
            ? entry.data.rejectReasonConfig
                .map(reason => reason.descr)
                .filter(isDefined)
            : undefined,
          additionalMsg: entry.data.addtionalMsg,
          projectName: entry.data.name,
          projectId: toNumber(entry.data.id),
        },
      };
    case 'remindUseBids':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          username: entry.data.username,
          bidsRemaining: entry.data.bids_remaining,
          imgUrl: undefined,
        },
      };
    case 'suggestionForFreelancerAfterReceiveReview':
      return {
        type: 'suggestionForFreelancerAfterReceiveReview',
        parent_type: entry.parent_type,
        // Do not show multiple times in the news feed.
        id: 'suggestionForFreelancerAfterReceiveReview',
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          projectName: entry.data.projectName,
          seoUrl: entry.data.seoUrl
            ? entry.data.seoUrl.toString()
            : entry.data.projectId.toString(),
          username: entry.data.userName,
        },
      };
    case 'uploadFile':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        // TODO: This breaks pagination as we get less entries than we asked the API for
        id: `${userId}:uploadFile:${entry.data.projectId}`,
        time: entry.timestamp * 1000,
        data: {
          filesList: [],
          imgUrl:
            entry.data.img && typeof entry.data.img.logo_url === 'string'
              ? entry.data.img.logo_url
              : undefined,
          projectId: entry.data.projectId,
          projectName: entry.data.name,
          projectSeoUrl: `/projects/${entry.data.seoUrl}`,
          userId: toNumber(entry.data.userId),
          publicName: userDisplayName(
            entry.data.userName,
            entry.data.publicName,
          ),
          username: entry.data.userName,
          bidId: toNumber(entry.data.id),
          file: {
            id: toNumber(entry.data.file.id),
            name: entry.data.file.name,
            size: entry.data.file.size,
            isDriveFile: entry.data.file.isDriveFile,
          },
          time: entry.data.time * 1000,
        },
      };
    case 'welcome':
      return {
        type: 'welcome',
        parent_type: 'notifications',
        id: 'welcome',
        time: entry.timestamp * 1000,
        data: {
          accountSetup: false,
          imgUrl: undefined,
          siteName: entry.data.siteName,
        },
      };
    case 'winningDesignReadyForReview':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: toNumber(entry.timestamp) * 1000 + 15, // Bump on top of others
        data: {
          autoReleasePrizeTime:
            (toNumber(entry.data.autoReleasePrizeTime) || 2592000) * 1000,
          contestName: entry.data.contest_name,
          contestUrl: entry.data.contest_url,
          entryId: entry.data.entry_id,
          imgUrl: entry.data.imgUrl,
          winnerName: entry.data.winner_name,
          winnerProfileUrl: entry.data.winner_profile_url,
          winnerPublicName: userDisplayName(
            entry.data.winner_name,
            entry.data.winner_publicName,
          ),
        },
      };

    default:
      return assertNever(entry);
  }
}

export function transformWebsocketNewsfeed(
  entry: NewsfeedApiEntry,
  userId: string,
): NewsfeedEntry | undefined {
  const transformed = transformNewsfeed(entry, userId);
  return isNewsfeedEntry(transformed) ? transformed : undefined;
}

export interface AdditionalBidEventFields {
  readonly publicName?: string;
}

export function transformWebsocketBidToBidEvent(
  payload: WebsocketActionPayload,
): NewsfeedBidEvent {
  return {
    id: payload.data.bid.id,
    bidderId: payload.data.bid.users_id,
    projectId: payload.data.bid.project_id,
    amount: toNumber(payload.data.amount),
    period: payload.data.bid.period,
    description: payload.data.bid.descr,
    submitDate: payload.data.bid.submitdate_ts * 1000,
    publicName: userDisplayName(
      payload.data.bid.user.username,
      payload.data.bid.user.publicName,
    ),
    score: payload.data.bid.score,
    username: payload.data.bid.user.username,
    award: payload.data.award,
    userAvatar: payload.data.bid.user.logo_url,
    currency: {
      id: payload.data.currencyId,
      code: payload.data.currencyCode,
      sign: payload.data.currency,
    },
    userRatingAvg: payload.data.bid.user
      ? payload.data.bid.user.seller_rating.avg
      : undefined,
    userRatingCount: payload.data.bid.user
      ? payload.data.bid.user.seller_rating.count
      : undefined,
    userEarnings: payload.data.bid.user
      ? payload.data.bid.user.earnings
      : undefined,
  };
}

export function transformWebsocketUploadedFile(
  payload: WebsocketActionPayload,
): NewsfeedUploadFile {
  return {
    id: payload.data.file.id,
    name: payload.data.file.name,
    size: payload.data.file.size,
    isDriveFile: payload.data.file.isDriveFile,
    time: payload.data.time * 1000,
  };
}

export function transformWebsocketContestEntryToEntryApi(
  payload: WebsocketActionPayload,
): NewsfeedContestEntry {
  return {
    id: toNumber(payload.data.entryId),
    userId: toNumber(payload.data.userId),
    entryNumber: toNumber(payload.data.entryNumber),
    entryThumb: payload.data.entryThumb,
    entryUrl: payload.data.entryUrl,
    imgUrl:
      payload.data.freelancerImg &&
      typeof payload.data.freelancerImg.logo_url === 'string'
        ? payload.data.freelancerImg.logo_url
        : undefined,
    username: payload.data.freelancerName,
    publicName: payload.data.freelancerPublicName,
    time: toNumber(payload.data.time) * 1000,
  };
}

export function transformWebsocketContestEntryRated(
  payload: WebsocketActionPayload,
): NewsfeedContestEntryRated {
  return {
    id: toNumber(payload.data.entryId),
    thumb: payload.data.entryThumb,
    rating: payload.data.rating,
    time: toNumber(payload.data.time) * 1000,
  };
}

function parseStringWithLinks(text: string): ReadonlyArray<ParsedLinksString> {
  let items: ReadonlyArray<ParsedLinksString> = [];
  let formattedLinks: ReadonlyArray<LinkElement> = [];
  // Replace all links with this hook in string so we can easily split it
  const linkSeparator = `{{--link--}}`;
  // Regex to extract links
  const linkReg = /<a(\s[^>]*)?>.*?<\/a>/gi;
  // Regex to extract href link from <a> tag
  const hrefRegex = /\s*href\s*=\s*("([^"]*")|'[^']*'|([^'">\s]+))/;

  // Find all links in string
  const linksInText = text.match(linkReg);

  let replacedText = text;
  if (linksInText) {
    // Replace all links with `{{--link--}}` hook
    linksInText.forEach(
      link => (replacedText = replacedText.replace(link, linkSeparator)),
    );

    linksInText.forEach(link => {
      // Extract link text
      const linkText = link.match(/<a[^\b>]+>(.+)[<]\/a>/);
      // Extract href value from <a>
      const hrefMatches = link.match(hrefRegex);
      // And remove all quotes from result
      const linkUrl = hrefMatches ? hrefMatches[1].replace(/['"]+/g, '') : '';
      // Split Link Url to plain Url string and query string
      const [plainLink, paramsString] = linkUrl.split('?');
      // If link has some parameters, transform them to {[key: string]: any}
      const linkParams = paramsString
        ? parseQueryString(paramsString)
        : undefined;
      const doc = new DOMParser().parseFromString(
        linkText ? linkText[1] : '',
        'text/html',
      );
      // Add link to links array
      formattedLinks = [
        ...formattedLinks,
        {
          text:
            doc && doc.documentElement && doc.documentElement.textContent
              ? doc.documentElement.textContent.toString()
              : '',
          url: plainLink,
          params: linkParams,
        },
      ];
    });
  }

  // Split initial string by `{{--link--}}` hook
  const parts = replacedText.split(linkSeparator);
  // Merge text parts with links. The last one will have link undefined
  parts.forEach((part, index) => {
    const doc = new DOMParser().parseFromString(part, 'text/html');
    items = [
      ...items,
      {
        text:
          doc && doc.documentElement && doc.documentElement.textContent
            ? doc.documentElement.textContent.toString()
            : '',
        link:
          parts.length > index + 1 && linksInText
            ? formattedLinks[index]
            : undefined,
      },
    ];
  });

  return items;
}

/**
 * Converts URL query string to {[key: string]: any} object
 */
function parseQueryString(query: string) {
  const params = new URLSearchParams(query);
  let entries: ReadonlyArray<{ [key: string]: any }> = [];
  params.forEach((value, key) => {
    entries = [...entries, { key, value }];
  });
  return entries.length > 0
    ? entries.reduce((arr: { [key: string]: any }, entry: any) => {
        const { key, value } = entry;
        // add as value if not set, add to array if already set
        arr[key] =
          typeof arr[key] === 'undefined' ? value : [].concat(arr[key], value);
        return arr;
      }, {})
    : {};
}
