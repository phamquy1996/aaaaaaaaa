import { ContestViewEntry, User } from '@freelancer/datastore/collections';

export enum ContestAwardModalResponseType {
  AWARD_MULTIPLE,
  ERROR,
}

export interface ContestAwardModalErrorResponse {
  type: ContestAwardModalResponseType.ERROR;
  errorCode: string;
}

export interface ContestAwardModalMultipleAwardResponse {
  type: ContestAwardModalResponseType.AWARD_MULTIPLE;
}

export type ContestAwardModalResponse =
  | ContestAwardModalErrorResponse
  | ContestAwardModalMultipleAwardResponse
  | undefined;

export interface ContestAwardModalDetails {
  readonly entry: ContestViewEntry;
  readonly freelancer: User;
  readonly canMultiAward: boolean;
}
