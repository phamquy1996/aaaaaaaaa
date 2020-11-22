import { BidAwardStatusApi } from 'api-typings/projects/projects';

/**
 * Represents a project offer reply (accept or reject)
 * from a "project offer" like hireme or award
 */
export enum ProjectOfferActionType {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export interface ProjectOffer {
  readonly id: number;
  readonly projectId: number;
  readonly freelancerId: number;
  readonly awardStatus: BidAwardStatusApi;
}
