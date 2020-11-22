export enum BidEditRequestAction {
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

export interface BidEditRequestUpdatePayload {
  readonly action: BidEditRequestAction;
}
