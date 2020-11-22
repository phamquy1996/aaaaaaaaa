import { BidApi } from 'api-typings/projects/projects';
import { UserApi } from 'api-typings/users/users';
import { transformDisplayedLocation } from '../project-view-projects/project-view-projects.transformers';
import { transformLocation } from '../users/users-location.transformers';
import { ProjectViewBidderLocation } from './project-view-bidder-locations.model';

export function transformProjectViewBidderLocations(bidAndBidder: {
  readonly user: UserApi | undefined;
  readonly bid: BidApi | undefined;
}): ProjectViewBidderLocation {
  if (!bidAndBidder.user || !bidAndBidder.user.location || !bidAndBidder.bid) {
    throw new ReferenceError(`Missing a required user field.`);
  }

  return {
    id: bidAndBidder.user.id,
    userId: bidAndBidder.user.id,
    projectId: bidAndBidder.bid.project_id,
    bidId: bidAndBidder.bid.id,
    location: transformLocation(bidAndBidder.user.location),
    trueLocation: bidAndBidder.user.true_location
      ? transformLocation(bidAndBidder.user.true_location)
      : undefined,
    displayLocation: transformDisplayedLocation(
      bidAndBidder.user.true_location || bidAndBidder.user.location,
    ),
  };
}
