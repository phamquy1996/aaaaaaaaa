export enum ContestEntryAction {
  RATE = 'rate',
  AWARD = 'award',
  BUY = 'buy',
  REJECT = 'reject',
  RECONSIDER = 'reconsider',
  LIKE = 'like',
  DISLIKE = 'dislike',
}

export interface ContestViewEntriesUpdateActionRawPayload {
  readonly action: ContestEntryAction;
  readonly rating?: number;
}
