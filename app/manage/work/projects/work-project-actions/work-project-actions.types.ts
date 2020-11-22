import { ProjectStatusFromBids } from '@freelancer/project-status';

export enum WorkProjectActions {
  EDIT_BID = 'Edit',
  CHAT = 'Chat',
  UPGRADE_BID = 'Upgrade',
  RETRACT_BID = 'Retract',
  ACCEPT_AWARD = 'Accept',
  REJECT_AWARD = 'Reject',
  VIEW_MILESTONES = 'View Milestones',
  REQUEST_MILESTONE = 'Request Milestone',
  VIEW_PROPOSAL = 'View Proposal',
}

export interface WorkProjectActionBidChanges {
  readonly id: number;
  readonly newStatus?:
    | ProjectStatusFromBids.ACCEPTED
    | ProjectStatusFromBids.REJECTED;
  readonly retracted?: boolean;
}

export enum WorkProjectModalAction {
  CONFIRM_ACCEPT_AWARD,
  CONFIRM_RETRACT_BID,
}
