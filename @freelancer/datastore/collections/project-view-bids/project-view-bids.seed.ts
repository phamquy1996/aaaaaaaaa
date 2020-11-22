import {
  generateId,
  generateNumbersInRangeWithDuplicates,
} from '@freelancer/datastore/testing';
import { PartialBy } from '@freelancer/types';
import { RECOMMENDED_CUTOFF } from '../bids/bids.backend-model';
import { Bid } from '../bids/bids.model';
import { User } from '../users/users.model';
import { ProjectViewBid } from './project-view-bids.model';

export interface GenerateProjectViewBidsOptions {
  readonly bids: ReadonlyArray<Bid>;
  readonly minScore?: number;
  readonly maxScore?: number;
}

export function generateProjectViewBidObjects({
  bids,
  minScore = 0,
  maxScore = 1,
}: GenerateProjectViewBidsOptions): ReadonlyArray<ProjectViewBid> {
  const scores = generateNumbersInRangeWithDuplicates(
    minScore,
    maxScore,
    bids.length,
    'bidScores',
  );

  const actualMaxScore = Math.max(...scores);

  /**
   * There could be more than one with the max score.
   * If so we arbitrarily pick the first.
   * The score must also be above RECOMMENDED_CUTOFF to be recommended.
   */
  const recommendedBidIndex = scores.findIndex(
    score => score === actualMaxScore && score > RECOMMENDED_CUTOFF,
  );

  return bids.map((bid, index) => ({
    ...bid,
    score: scores[index],
    recommended: index === recommendedBidIndex,
  }));
}

/**
 * Transformer for UI tests that need to propagate pushes from `bids` to
 * `projectViewBids`, e.g. FPVP bid form.
 */
export function bidToProjectViewBidTransformer(
  authUid: number,
  bid: PartialBy<Bid, 'id'>,
): ProjectViewBid {
  return {
    ...bid,
    id: bid.id ?? generateId(),
    score: bid.score ?? Number.NEGATIVE_INFINITY, // FPVP doesn't get to see bid scores
    recommended: false,
  };
}

// Order by descending order of bid score, then further by submit date.
// This is used to assert the order of lists of bids in UI tests.
export function orderBidsByBidScore(
  bids: ReadonlyArray<ProjectViewBid>,
  bidders: ReadonlyArray<User>,
): ReadonlyArray<
  ProjectViewBid & { readonly displayName: string | undefined }
> {
  return bids
    .map(bid => ({
      ...bid,
      displayName: bidders.find(user => user.id === bid.bidderId)?.displayName,
    }))
    .sort((a, b) => {
      if (a.score === b.score) {
        return b.submitDate - a.submitDate;
      }
      return b.score - a.score;
    });
}
