import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RecursivePartial,
} from '@freelancer/datastore/core';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import {
  BidEmployerActions,
  BidOwnerActions,
  BidProjectAction as ProjectAction,
  BidUpdateActionRawPayload,
} from './bids.backend-model';
import { Bid } from './bids.model';
import { BidsCollection } from './bids.types';

export function bidsBackend(): Backend<BidsCollection> {
  return {
    defaultOrder: {
      field: 'submitDate',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50040 This uses `first_submitdate` which is not returned
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/bids`,
      params: {
        bids: ids,
        bidders: getQueryParamValue(query, 'bidderId'),
        projects: getQueryParamValue(query, 'projectId'),
        frontend_bid_statuses: getQueryParamValue(query, 'frontendBidStatus'),
        award_statuses: getQueryParamValue(query, 'awardStatus'),
        complete_statuses: getQueryParamValue(query, 'completeStatus'),
        project_owners: getQueryParamValue(query, 'projectOwnerId'),
      },
    }),
    push: pushBid,
    set: undefined,
    update: updateBid,
    remove: undefined,
  };
}
export function pushBid(authUid: string, bid: Omit<Bid, 'id'>) {
  return {
    endpoint: `projects/0.1/bids/`,
    asFormData: false,
    payload: {
      project_id: bid.projectId,
      bidder_id: bid.bidderId,
      amount: bid.amount,
      period: bid.period,
      milestone_percentage: bid.milestonePercentage || 50,
      description: bid.description,
      sponsored: bid.sponsored,
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
export function updateBid(
  authUid: string,
  bidDelta: RecursivePartial<Bid>,
  originalBid: Bid,
) {
  const endpoint = `projects/0.1/bids/${originalBid.id}`;
  const method: 'PUT' | 'POST' = 'PUT';
  let payload: BidUpdateActionRawPayload | undefined;
  let asFormData = true;

  switch (bidDelta.awardStatus) {
    // Award a bid, then bid status is pending
    case BidAwardStatusApi.PENDING:
      if (!bidDelta.extraForUpdate) {
        payload = {
          action: BidEmployerActions.AWARD,
        };
      } else {
        payload = {
          action: BidEmployerActions.AWARD,
          work_limit: bidDelta.extraForUpdate.workLimit,
          billing_cycle: bidDelta.extraForUpdate.billingCycle,
          skip_hourly_contract: bidDelta.extraForUpdate.skipHourlyContract,
        };
      }
      break;

    // Employer revoke bid
    case BidAwardStatusApi.REVOKED:
      payload = { action: BidEmployerActions.REVOKE };
      break;

    // Freelancer deny turn into rejected status
    case BidAwardStatusApi.REJECTED:
      payload = {
        action: BidOwnerActions.DENY,
        reason_code: bidDelta.rejectReasonCode,
        other_feedback: bidDelta.otherFeedback,
      };
      break;

    // Freelancer accept employer's award bid action, bid is awarded
    case BidAwardStatusApi.AWARDED:
      payload = { action: BidOwnerActions.ACCEPT };
      break;
    default:
      break;
  }

  if (
    bidDelta.shortlisted !== undefined &&
    bidDelta.shortlisted !== originalBid.shortlisted
  ) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }
    payload = bidDelta.shortlisted
      ? { action: BidEmployerActions.SHORTLIST }
      : { action: BidEmployerActions.UNSHORTLIST };
  }

  if (bidDelta.hidden !== undefined && bidDelta.hidden !== originalBid.hidden) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }
    payload = bidDelta.hidden
      ? { action: BidEmployerActions.HIDE }
      : { action: BidEmployerActions.UNHIDE };
  }

  if (
    bidDelta.isLocationTracked !== undefined &&
    bidDelta.isLocationTracked !== originalBid.isLocationTracked
  ) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }
    if (!bidDelta.isLocationTracked) {
      throw new Error('You cannot update the isLocationTracked to false');
    }
    payload = { action: BidEmployerActions.REQUEST_LOCATION_SHARING };
  }

  if (bidDelta.highlighted) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }
    payload = { action: BidOwnerActions.HIGHLIGHT };
  }

  if (bidDelta.retracted) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }
    payload = { action: BidOwnerActions.RETRACT };
  }

  // Check if front-end trying to update the bid
  if (
    bidDelta.description !== undefined ||
    bidDelta.period !== undefined ||
    bidDelta.amount !== undefined
  ) {
    if (payload) {
      throw new Error('Cannot update with action and bid at once');
    }
    payload = {
      description: bidDelta.description,
      period: bidDelta.period,
      amount: bidDelta.amount,
    };
    asFormData = false;
  }

  if (bidDelta.completeStatus) {
    if (payload) {
      throw new Error('Cannot update two requests at once');
    }

    const bidCompleteEndpoint = `projects/0.1/projects/${originalBid.projectId}`;

    payload = {
      action: ProjectAction.END,
      bid_id: originalBid.id,
      status: bidDelta.completeStatus,
    };

    // marking the bid as complete uses a different endpoint
    // so we need to return early here
    return {
      asFormData: true,
      method,
      endpoint: bidCompleteEndpoint,
      payload,
    };
  }

  if (payload) {
    return {
      asFormData,
      payload,
      endpoint,
      method,
    };
  }
  throw new Error('Cannot update for bids');
}
