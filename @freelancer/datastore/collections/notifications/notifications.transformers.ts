import { assertNever, toNumber } from '@freelancer/utils';
import { NewsfeedApiEntry } from '../newsfeed/newsfeed.backend-model';
import { NotificationEntry } from '../newsfeed/newsfeed.model';
import {
  isNotificationEntry,
  NewsFeedApiEntrySkipped,
  newsfeedApiEntrySkipped,
  transformArticleCommentApiEntry,
  transformAwardApiEntry,
  transformBidApiEntry,
  transformContestAwardedToEmployerApiEntry,
  transformContestAwardedToFreelancerApiEntry,
  transformCreateMilestoneApiEntry,
  transformDeniedApiEntry,
  transformDraftContestApiEntry,
  transformHireMeApiEntry,
  transformInviteToContestApiEntry,
  transformInviteUserBidApiEntry,
  transformInvoiceRequestedApiEntry,
  transformProjectCompletedApiEntry,
  transformProjectData,
  transformReleaseMilestoneApiEntry,
  transformRequestEndProjectApiEntry,
  transformRequestMilestoneApiEntry,
  transformRequestToReleaseApiEntry,
  transformShowcaseSourceApproval,
} from '../newsfeed/newsfeed.transformers';

export function transformNotification(
  entry: NewsfeedApiEntry,
  userId: string,
): NotificationEntry | NewsFeedApiEntrySkipped {
  switch (entry.type) {
    // Unsupported notifications events
    case 'aborted':
    case 'acceptDisputeOffer':
    case 'accepted':
    case 'activateFreelancer':
    case 'adminForceVarifyPhone':
    case 'adminWarningUserBidRestriction':
    case 'banUserFromBidding':
    case 'bidHidden': // TODO: T38861 bidHidden in A/B test & not implemented
    case 'bidsRunningOut':
    case 'buyFreeMarketService':
    case 'collaboratorAddedViaChat':
    case 'collaboratorsUpdatedRefreshChat':
    case 'communityPromoNoti':
    case 'completeContestReview':
    case 'completeReview':
    case 'contactRequestReceived':
    case 'contactRequestSent':
    case 'contactsAutoAddedReceiver':
    case 'contactsAutoAddedSender':
    case 'contest':
    case 'contest_pcb':
    case 'contestComplete':
    case 'contestCompleteSellEntryUpsell':
    case 'contestCreated':
    case 'contestEntryCreated':
    case 'contestEntryRated':
    case 'contestExpired':
    case 'contestLockedEmployer':
    case 'contestLockedFreelancer':
    case 'contestreviewposted':
    case 'contestUpsellFeaturedUpgrade':
    case 'counterOffer':
    case 'customAdminNotification':
    case 'deleteFile':
    case 'directTransferDone':
    case 'downgradeToFreeMembershipNoti':
    case 'draftContestRealtime':
    case 'editAwardedBidAccepted':
    case 'editAwardedBidDeclined':
    case 'editAwardedBidRequest':
    case 'emailChange':
    case 'employerWelcome':
    case 'escalateDispute':
    case 'examPassedUpsell':
    case 'examRetakingDiscount':
    case 'expertsPromoNoti':
    case 'failingProject':
    case 'firstEarning':
    case 'freeMarketServiceExpired':
    case 'freeMarketServiceIsExpired':
    case 'generic':
    case 'hostingRequest':
    case 'hostingShare':
    case 'inviteFriends':
    case 'invoiceAcceptedPartial':
    case 'invoiceFeedback':
    case 'invoicePaid':
    case 'invoicePartialPaid':
    case 'invoiceRequestChange':
    case 'invoiceWithdrawn':
    case 'kyc':
    case 'localJobPosted':
    case 'localJobsActivation':
    case 'makeDisputeOffer':
    case 'negotiatedProjectStatusChange':
    case 'newDispute':
    case 'pendingFunds':
    case 'pmb':
    case 'pmb_public':
    case 'postDraftProject':
    case 'postOnBehalfProject':
    case 'prehireProjectCreated':
    case 'prizeDispersedEmployer':
    case 'prizeDispersedFreelancer':
    case 'project':
    case 'projectEmailVerificationRequiredEvent':
    case 'projectHireMeExpired':
    case 'projectSharedWithYou':
    case 'projectStatusChange':
    case 'promoteContest':
    case 'recruiterProject':
    case 'rejected':
    case 'rejectOnBehalfProject':
    case 'releasePartMilestone':
    case 'remindUseBids':
    case 'removeUserFromDirectory':
    case 'reviewActivate':
    case 'reviewPending':
    case 'reviewposted':
    case 'reviewpostednew':
    case 'revoked':
    case 'secondBidPlusTrialUpsell':
    case 'sellFreeMarketService':
    case 'sendDisputeMessage':
    case 'serviceLimitReached':
    case 'serviceProjectEndedBuyer':
    case 'serviceProjectEndedSeller':
    case 'serviceProjectPostedBuyer':
    case 'serviceSellerPromotion':
    case 'serviceStatusChanged':
    case 'serviceSubmitted':
    case 'showcasePromoNoti':
    case 'sitesBidCreated':
    case 'sitesBinCreated':
    case 'sitesHandOverMessageSent':
    case 'sitesListingStatusChanged':
    case 'sitesMessageSent':
    case 'sitesOfferCreated':
    case 'specialLoyaltyDiscount':
    case 'sponsor_bid':
    case 'submitOnBehalfProject':
    case 'suggestionForFreelancerAfterReceiveReview':
    case 'supportGetHelpNewsfeed':
    case 'tasklist_create': // Renamed to tasklistCreateV1
    case 'tombstoneNoti':
    case 'tombstoneNotiEmployer':
    case 'tombstoneNotiFreelancer':
    case 'updateMilestone':
    case 'upgradeToNonFreeMembership':
    case 'uploadFile':
    case 'upsellAssistedUpgrade':
    case 'upsellFeatureUpgrade':
    case 'upsellIntro':
    case 'upsellPlusTrial':
    case 'userReportsActionBidRestriction':
    case 'userSideAction':
    case 'userSideActionFeedback':
    case 'welcome':
    case 'winningDesignReadyForReview':
    case 'xpContest':
    case 'yahooMailAlert':
      return newsfeedApiEntrySkipped(entry);

    // Supported notification events
    case 'articleCommentReceived':
      return transformArticleCommentApiEntry(entry);
    case 'award':
      return transformAwardApiEntry(entry, userId);
    case 'awardBadge':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          descr: entry.data.descr,
          imgUrl: undefined,
          linkUrl: entry.data.linkUrl,
          name: entry.data.name,
        },
      };
    case 'awardCredit':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          amount: toNumber(entry.data.amount),
          imgUrl: undefined,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'awardReminder':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: entry.data.imgUrl,
          linkUrl: `${entry.data.linkUrl}?gotoBid=${entry.data.bid.id}`,
          name: entry.data.name,
          username: entry.data.userName,
        },
      };
    case 'awardMilestoneReminder':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          appendedDescr: entry.data.appended_descr,
          currencyCode: entry.data.currencycode,
          currencyId: entry.data.currencyid,
          currencySign: entry.data.currencysign,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          isHourlyProject: entry.data.projIsHourly,
          title: entry.data.title,
          userId: toNumber(entry.data.userId),
          username: entry.data.userName,
        },
      };
    case 'awardXp':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          amount: toNumber(entry.data.amount),
          descr: entry.data.descr,
          imgUrl: undefined,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'bid':
    case 'bid_self':
    case 'bid_updated':
      return transformBidApiEntry(entry, userId);
    case 'completed':
      return transformProjectCompletedApiEntry(entry, userId);
    case 'contestAwardedToEmployer':
      return transformContestAwardedToEmployerApiEntry(entry);
    case 'contestAwardedToFreelancer':
      return transformContestAwardedToFreelancerApiEntry(entry);
    case 'contestEntry':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestHolder: entry.data.contestHolder,
          contestId: entry.data.contestId,
          contestName: entry.data.contestName,
          firstUser: entry.data.firstUser,
          firstUserPublicName: entry.data.firstUserPublicName,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          secondUser: entry.data.secondUser || undefined,
          secondUserPublicName: entry.data.secondUserPublicName || undefined,
          userId: toNumber(entry.data.userId),
        },
      };
    case 'contestEntryBoughtToEmployer':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestName: entry.data.contestName,
          entryId: entry.data.entry_id,
          entryNumber: entry.data.entry_number,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          publicName: entry.data.publicName,
          username: entry.data.userName,
        },
      };
    case 'contestEntryBoughtToFreelancer':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestName: entry.data.contestName,
          entryId: entry.data.entry_id,
          entryNumber: entry.data.entry_number,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          publicName: entry.data.publicName,
          username: entry.data.userName,
        },
      };
    case 'contestEntryCommentedToFreelancer': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          entryNumber: toNumber(entry.data.entryNumber),
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    }
    case 'contestPCBNotification': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestHolder: entry.data.contestHolder,
          contestId: entry.data.contestId,
          contestName: entry.data.contestName,
          firstUser: entry.data.firstUser,
          firstUserPublicName: entry.data.firstUserPublicName,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          secondUser: entry.data.secondUser || undefined,
          secondUserPublicName: entry.data.secondUserPublicName || undefined,
          userId: entry.data.userId,
          userCount: entry.data.userCount,
        },
      };
    }
    case 'contestPCBNotificationFullView': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          contestHolder: entry.data.contestHolder,
          contestName: entry.data.contestName,
          entryNumber: toNumber(entry.data.entryNumber),
          firstUser: entry.data.firstUser,
          firstUserPublicName: entry.data.firstUserPublicName,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          secondUser: entry.data.secondUser || undefined,
          secondUserPublicName: entry.data.secondUserPublicName || undefined,
          userId: entry.data.userId,
          userCount: entry.data.userCount,
        },
      };
    }
    case 'contestEntryRatedToFreelancer': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          action: entry.data.action,
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          employerId: toNumber(entry.data.employerId),
          entriesUrl: entry.data.entriesUrl,
          entryId: toNumber(entry.data.entryId),
          entryNumber: toNumber(entry.data.entryNumber),
          entryS3path: entry.data.entryS3path,
          entryThumb: entry.data.entryThumb,
          entryUrl: entry.data.entryUrl,
          freelancerId: toNumber(entry.data.freelancerId),
          hasOtherEntriesRatedOrRejected:
            entry.data.hasOtherEntriesRatedOrRejected,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          ratedOrRejectedEntriesCount: toNumber(
            entry.data.ratedOrRejectedEntriesCount,
          ),
          rating: entry.data.rating,
        },
      };
    }
    case 'contestEntryReconsideredToFreelancer': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          action: entry.data.action,
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          employerId: toNumber(entry.data.employerId),
          entriesUrl: entry.data.entriesUrl,
          entryId: toNumber(entry.data.entryId),
          entryNumber: toNumber(entry.data.entryNumber),
          entryS3path: entry.data.entryS3path,
          entryThumb: entry.data.entryThumb,
          entryUrl: entry.data.entryUrl,
          freelancerId: toNumber(entry.data.freelancerId),
          hasOtherEntriesRatedOrRejected:
            entry.data.hasOtherEntriesRatedOrRejected,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          ratedOrRejectedEntriesCount: toNumber(
            entry.data.ratedOrRejectedEntriesCount,
          ),
          rating: entry.data.rating,
        },
      };
    }
    case 'contestEntryRejectedToFreelancer': {
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          action: entry.data.action,
          contestId: toNumber(entry.data.contestId),
          contestName: entry.data.contestName,
          employerId: toNumber(entry.data.employerId),
          entriesUrl: entry.data.entriesUrl,
          entryId: toNumber(entry.data.entryId),
          entryNumber: toNumber(entry.data.entryNumber),
          entryS3path: entry.data.entryS3path,
          entryThumb: entry.data.entryThumb,
          entryUrl: entry.data.entryUrl,
          freelancerId: toNumber(entry.data.freelancerId),
          hasOtherEntriesRatedOrRejected:
            entry.data.hasOtherEntriesRatedOrRejected,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
          ratedOrRejectedEntriesCount: toNumber(
            entry.data.ratedOrRejectedEntriesCount,
          ),
          rating: entry.data.rating,
        },
      };
    }
    case 'createMilestone':
      return transformCreateMilestoneApiEntry(entry);
    case 'denyed':
      return transformDeniedApiEntry(entry, userId);
    case 'draftContest':
      return transformDraftContestApiEntry(entry, userId);
    case 'giveGetChildReceivedSignupBonus':
      return {
        id: entry.id,
        type: entry.type,
        parent_type: entry.parent_type,
        time: entry.timestamp * 1000,
        data: {
          parentId: entry.data.parentId,
          childId: entry.data.childId,
          bonus: entry.data.bonus,
          currencyCode: entry.data.currencyCode,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'giveGetChildSignUp':
      return {
        id: entry.id,
        type: entry.type,
        parent_type: entry.parent_type,
        time: entry.timestamp * 1000,
        data: {
          parentId: entry.data.parentId,
          childId: entry.data.childId,
          childName: entry.data.childName,
          bonus: entry.data.bonus,
          bonusRequirement: entry.data.bonusRequirement,
          currencyCode: entry.data.currencyCode,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'giveGetChildPartialMilestoneRelease':
      return {
        id: entry.id,
        type: entry.type,
        parent_type: entry.parent_type,
        time: entry.timestamp * 1000,
        data: {
          parentId: entry.data.parentId,
          childId: entry.data.childId,
          childName: entry.data.childName,
          bonusRequirement: entry.data.bonusRequirement,
          currencyCode: entry.data.currencyCode,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'giveGetParentBonus':
      return {
        id: entry.id,
        type: entry.type,
        parent_type: entry.parent_type,
        time: entry.timestamp * 1000,
        data: {
          parentId: entry.data.parentId,
          bonus: entry.data.bonus,
          currencyCode: entry.data.currencyCode,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    case 'highLtvAnnualDiscount':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          linkUrl: entry.data.linkUrl,
          userDisplayName: entry.data.userDisplayName,
        },
      };
    case 'inviteUserBid':
      return transformInviteUserBidApiEntry(entry);
    case 'inviteToContest':
      return transformInviteToContestApiEntry(entry);
    case 'invoiceRequested':
      return transformInvoiceRequestedApiEntry(entry);
    case 'levelUp':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          level: entry.data.level,
          linkUrl: entry.data.linkUrl,
          membership: entry.data.membership,
          perks: entry.data.perks,
          username: entry.data.username,
        },
      };
    case 'notifyfollower':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: transformProjectData(entry.data),
      };
    case 'hireMe':
      return transformHireMeApiEntry(entry);
    case 'quickHireProject':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          ...transformProjectData(entry.data),
          currency: entry.data.currency,
          period: toNumber(entry.data.period),
          projIsHourly: entry.data.projIsHourly,
          publicName: entry.data.publicName,
          sum: toNumber(entry.data.sum),
        },
      };
    case 'releaseMilestone':
      return transformReleaseMilestoneApiEntry(entry);
    case 'requestEndProject':
      return transformRequestEndProjectApiEntry(entry);
    case 'requestMilestone':
      return transformRequestMilestoneApiEntry(entry);
    case 'requestToRelease':
      return transformRequestToReleaseApiEntry(entry);
    case 'serviceProjectEndingSeller':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          bidId: toNumber(entry.data.bid_id),
          buyerId: toNumber(entry.data.buyer_id),
          buyerName: entry.data.buyer_name,
          hoursRemaining: toNumber(entry.data.hours_remaining),
          imgUrl: undefined,
          linkUrl: entry.data.project_url,
          orderStartDate: entry.data.order_start_date,
          projectId: toNumber(entry.data.project_id),
          projectName: entry.data.project_name,
          projectUrl: entry.data.project_url,
          sellerId: toNumber(entry.data.seller_id),
          sellerName: entry.data.seller_name,
          serviceId: toNumber(entry.data.service_id),
          serviceName: entry.data.service_name,
        },
      };
    case 'serviceProjectPostedSeller':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          bidId: toNumber(entry.data.bid_id),
          buyerId: toNumber(entry.data.buyer_id),
          buyerImgUrl: entry.data.buyer_img_url,
          buyerName: entry.data.buyer_name,
          buyerPublicName: entry.data.buyer_public_name,
          currencyCode: entry.data.currency_code,
          currencySign: entry.data.currency_sign,
          imgUrl: entry.data.buyer_img_url,
          linkUrl: entry.data.project_url,
          orderEndDate: entry.data.order_end_date,
          orderStartDate: entry.data.order_start_date,
          projectCost: toNumber(entry.data.project_cost),
          // projectDuration: entry.data.project_duration,
          projectId: toNumber(entry.data.project_id),
          // projectMilestones: entry.data.project_milestones,
          projectName: entry.data.project_name,
          projectUrl: entry.data.project_url,
          sellerId: toNumber(entry.data.seller_id),
          sellerImgUrl: entry.data.seller_img_url,
          sellerName: entry.data.seller_name,
          sellerPublicName: entry.data.seller_public_name,
          serviceId: toNumber(entry.data.service_id),
          serviceName: entry.data.service_name,
          serviceUrl: entry.data.service_url,
        },
      };
    case 'serviceApproved':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          linkUrl: entry.data.service_url,
          serviceId: toNumber(entry.data.service_id),
          serviceName: entry.data.service_name,
          serviceUrl: entry.data.service_url,
          serviceDuration: entry.data.service_duration,
          serviceCost: toNumber(entry.data.service_cost),
          currencySign: entry.data.currency_sign,
          currencyCode: entry.data.currency_code,
          serviceImg: entry.data.service_img, // A URL
        },
      };
    case 'serviceRejected':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          linkUrl: entry.data.service_url,
          serviceId: toNumber(entry.data.service_id),
          serviceName: entry.data.service_name,
          serviceUrl: entry.data.service_url,
          serviceDuration: entry.data.service_duration,
          serviceCost: toNumber(entry.data.service_cost),
          currencySign: entry.data.currency_sign,
          currencyCode: entry.data.currency_code,
          serviceImg: entry.data.service_img, // A URL
        },
      };
    case 'showcaseSourceApproval':
      return transformShowcaseSourceApproval(entry);
    case 'signUpFreeTrialUpsell':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          linkUrl: entry.data.linkUrl,
          trialPackageName: entry.data.trialPackageName,
        },
      };
    case 'upsellCrowdsourceFinding':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          imgUrl: undefined,
          linkUrl: undefined,
          projectName: entry.data.project_name,
        },
      };
    case 'tasklistCreateV1':
      return {
        type: entry.type,
        parent_type: entry.parent_type,
        id: entry.id,
        time: entry.timestamp * 1000,
        data: {
          ...entry.data,
          imgUrl: entry.data.imgUrl,
          linkUrl: entry.data.linkUrl,
        },
      };
    default:
      return assertNever(entry);
  }
}

export function transformWebsocketNotification(
  entry: NewsfeedApiEntry,
  userId: string,
): NotificationEntry | undefined {
  const transformed = transformNotification(entry, userId);
  return isNotificationEntry(transformed) ? transformed : undefined;
}
