import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RecursivePartial,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { pushBid, updateBid } from '../bids/bids.backend';
import { BidRatingsUpdateRawPayload } from '../bids/bids.backend-model';
import { BidRating } from '../bids/bids.model';
import { ProjectViewBidsCollection } from './project-view-bids.types';

export function projectViewBidsBackend(): Backend<ProjectViewBidsCollection> {
  return {
    // Employer sort by score high to low, freelancer sort by submit time recent to older
    // Freelancer doesn't get scores from backend, so first order will be skipped
    defaultOrder: [
      {
        field: 'score',
        direction: OrderByDirection.DESC,
      },
      {
        field: 'submitDate',
        direction: OrderByDirection.DESC,
      },
    ],
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects/${
        getQueryParamValue(query, 'projectId')[0]
      }/bids`,
      params: {
        bidders: getQueryParamValue(query, 'bidderId'),

        // Projections:
        bid_ratings: true,
      },
    }),
    push: pushBid,
    set: undefined,
    update: (authUid, delta, original) => {
      if (delta.rating) {
        if (Object.keys(delta).length > 1) {
          throw new Error(
            'Cannot update bid rating and other properties at the same time.',
          );
        }

        if (original.rating) {
          // Update the bid rating only.
          return updateBidRating(authUid, delta.rating, original.rating);
        }
        // Create a new bid rating.
        return createBidRating(authUid, delta.rating);
      }
      // Update the bid.
      return updateBid(authUid, delta, original);
    },
    remove: undefined,
  };
}

function createBidRating(
  authUid: string,
  bidRating: RecursivePartial<BidRating>,
) {
  if (
    !isDefined(bidRating.authorId) ||
    !isDefined(bidRating.bidId) ||
    !isDefined(bidRating.rating)
  ) {
    throw new Error('Cannot create bid ratings due to missing fields.');
  }

  return {
    method: 'POST' as const,
    endpoint: `projects/0.1/bids/${bidRating.bidId}/bid_ratings`,
    asFormData: false,
    payload: {
      bid_id: bidRating.bidId,
      comment: bidRating.comment,
      // rating values are [1, 5] and need to be scaled up to [20, 100]
      // this is due to the behaviour of the fl-rating bit, and I didn't want to change it
      rating: bidRating.rating * 20,
    },
  };
}

function updateBidRating(
  authUid: string,
  bidRating: RecursivePartial<BidRating>,
  original: BidRating,
) {
  const endpoint = `projects/0.1/bids/${original.bidId}/bid_ratings/${original.id}`;
  const method = 'PUT' as const;
  const asFormData = false;
  let payload: BidRatingsUpdateRawPayload | undefined;
  if (bidRating !== undefined) {
    if (payload) {
      throw new Error('Cannot update two bid ratings at once');
    }
    if (bidRating.rating !== undefined) {
      payload = { id: original.id, rating: bidRating.rating * 20 };
    }
    if (bidRating.comment !== undefined) {
      const rating = bidRating.rating ? bidRating.rating * 20 : 0;
      payload = { id: original.id, rating, comment: bidRating.comment };
    }
  }

  if (!isDefined(payload)) {
    throw new Error('Could not update due to invalid payload');
  }
  return {
    asFormData,
    payload,
    endpoint,
    method,
  };
}
