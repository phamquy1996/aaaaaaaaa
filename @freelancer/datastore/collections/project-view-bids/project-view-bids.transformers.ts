import { BidApi } from 'api-typings/projects/projects';
import { transformBid } from '../bids/bids.transformers';
import { ProjectViewBid } from './project-view-bids.model';

export function transformProjectViewBids(
  projectViewBid: BidApi,
  recommendedBid?: BidApi,
): ProjectViewBid {
  return {
    ...transformBid(projectViewBid),
    score:
      projectViewBid.score !== undefined
        ? projectViewBid.score
        : Number.NEGATIVE_INFINITY,
    recommended: !!recommendedBid && recommendedBid.id === projectViewBid.id,
  };
}
