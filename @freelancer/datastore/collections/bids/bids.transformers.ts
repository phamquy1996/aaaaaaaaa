import {
  WebsocketAcceptedEvent,
  WebsocketBidEvent,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { BidApi, BidRatingApi } from 'api-typings/projects/projects';
import { AWARD_EXPIRY_INTERVAL, Bid, BidRating } from './bids.model';

export function transformBid(bid: BidApi): Bid {
  if (!bid.submitdate) {
    throw new ReferenceError(`Bid missing submitdate.`);
  }

  return {
    id: bid.id,
    bidderId: bid.bidder_id,
    projectId: bid.project_id,
    retracted: bid.retracted,
    amount: bid.amount,
    period: bid.period,
    description: bid.description,
    projectOwnerId: bid.project_owner_id,
    submitDate: bid.submitdate * 1000,
    // buyerProjectFee?: Fee;
    timeSubmitted: bid.time_submitted ? bid.time_submitted * 1000 : undefined,
    highlighted: bid.highlighted,
    sponsored: bid.sponsored,
    milestonePercentage: bid.milestone_percentage,
    awardStatusPossibilities: bid.award_status_possibilities,
    awardStatus: bid.award_status,
    paidStatus: bid.paid_status,
    completeStatus: bid.complete_status,
    timeAwarded: bid.time_awarded ? bid.time_awarded * 1000 : undefined,
    frontendBidStatus: bid.frontend_bid_status,
    shortlisted: bid.shortlisted,
    score: bid.score,
    // negotiatedOffer?: NegotiatedOfferApi;
    hidden: bid.hidden,
    hiddenReason: bid.hidden_reason,
    timeAccepted: bid.time_accepted ? bid.time_accepted * 1000 : undefined,
    paidAmount: bid.paid_amount,
    hourlyRate: bid.hourly_rate,
    awardExpireTime:
      bid.time_awarded && bid.time_awarded * 1000 + AWARD_EXPIRY_INTERVAL,
    sealed: bid.sealed,
    completeStatusChangedTime: bid.complete_status_changed_time
      ? bid.complete_status_changed_time * 1000
      : undefined,
    awardStatusChangedTime: bid.award_status_changed_time
      ? bid.award_status_changed_time * 1000
      : undefined,
    isLocationTracked: bid.is_location_tracked,
    rating: bid.rating ? transformBidRatings(bid.rating) : undefined,
  };
}

// Used in two collections, returning similar model struct as Bid
export function transformWebsocketBidEvent(event: WebsocketBidEvent): Bid {
  return {
    id: toNumber(event.data.id),
    bidderId: toNumber(event.data.userId),
    projectId: toNumber(event.data.projectId),
    amount: toNumber(event.data.amount),
    period: toNumber(event.data.period),
    description: event.data.bid.descr || undefined,
    submitDate: event.data.bid.submitdate_ts
      ? event.data.bid.submitdate_ts * 1000
      : 0,
    highlighted: event.data.bid.highlighted || false,
    milestonePercentage: toNumber(event.data.bid.milestone_percentage),
    shortlisted: event.data.bid.isShortlisted || false,
    score: event.data.bid.score, // websocket will return 0 if bid score consumer not running
    hidden: event.data.bidHidden,
  };
}

export function transformWebsocketAcceptEvent(
  event: WebsocketAcceptedEvent,
): Partial<Bid> {
  return {
    id: toNumber(event.data.apiMessage.bid.id),
    bidderId: toNumber(event.data.apiMessage.bid.bidder_id),
    awardStatus: event.data.apiMessage.bid.award_status,
    completeStatus: event.data.apiMessage.bid.complete_status,
    period: toNumber(event.data.apiMessage.bid.period),
    amount: toNumber(event.data.apiMessage.bid.amount),
  };
}

function transformBidRatings(bidRating: BidRatingApi): BidRating {
  return {
    authorId: bidRating.author_id,
    bidId: bidRating.bid_id,
    comment: bidRating.comment,
    id: bidRating.id,
    rating: bidRating.rating / 20, // Ratings are [0, 100] and need to be scaled down to [0, 5].
    timeCreated: bidRating.time_created
      ? toNumber(bidRating.time_created) * 1000
      : undefined,
    timeUpdated: bidRating.time_updated
      ? toNumber(bidRating.time_updated) * 1000
      : undefined,
  };
}
