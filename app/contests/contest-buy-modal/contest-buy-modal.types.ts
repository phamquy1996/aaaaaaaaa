import {
  ContestEntryOffer,
  ContestViewContest,
  ContestViewEntry,
  User,
} from '@freelancer/datastore/collections';

export interface ContestBuyModalDetails {
  readonly contest: ContestViewContest;
  readonly entry: ContestViewEntry;
  readonly freelancer: User;
  readonly hasContestAwardedEntry: boolean;
  readonly currentOffer?: ContestEntryOffer;
  readonly canMultiAward: boolean;
}

export enum ContestBuyModalResponse {
  AWARD_ENTRY,
  START_CHAT,
}
