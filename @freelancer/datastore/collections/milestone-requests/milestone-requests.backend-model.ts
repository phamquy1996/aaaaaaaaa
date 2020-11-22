import { MilestoneRequestApi } from 'api-typings/projects/projects';

export interface MilestoneRequestUpdateActionRawPayload {
  readonly projectId: number;
  readonly bidId: number;
  readonly id: number;
  readonly description: string;
  readonly amount: number;
}

// from https://developers.freelancer.com/docs/projects/milestone-requests#milestone-requests-put
export interface MilestoneRequestActionRawPayload {
  readonly action?: MilestoneRequestAction;
}

export enum MilestoneRequestAction {
  ACCEPT = 'accept',
  DELETE = 'delete',
  REJECT = 'reject',
}

export interface MilestoneRequestsPostRawPayload {
  readonly project_id: number;
  readonly bid_id?: number;
  readonly description?: string;
  readonly amount?: number;
}

export type MilestoneRequestsPostApiResponse = MilestoneRequestApi;

export interface MilestoneRequestsUpdateResponseAjaxApi {
  readonly project_id: number;
  readonly bid_id: number;
  readonly id: number;
  readonly description: string;
  readonly amount: number;
  readonly created: boolean;
  readonly transaction_id: number | false;
  readonly deleted?: boolean;
  readonly rejected?: boolean;
  readonly creator_id?: number | null;
}
