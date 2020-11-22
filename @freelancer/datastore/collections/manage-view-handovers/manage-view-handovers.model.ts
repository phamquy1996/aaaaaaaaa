import {
  HandoversGetResultApi,
  HandoverUserRoleApi,
} from 'api-typings/contests/contests';
import { ContestHandover } from '../contest-handovers/contest-handovers.model';

/**
 * This is used for fetching handovers via the AJAX-API
 * endpoint which supports searching by:
 * - Contest Title
 * - Entry Title
 * - Entry Number
 * - Employer/Freelancer Username (depending on the user's role)
 *
 * The endpoint also returns the username of the opposite party.
 */
export type ManageViewHandover = ContestHandover & {
  readonly role: HandoverUserRoleApi;
  readonly handoverStatus: ManageHandoverStatus;
  readonly oppositePartyUsername: string;
};

export type ManageViewHandoverContext = HandoversGetResultApi & {
  readonly role: HandoverUserRoleApi;
};

export enum ManageHandoverStatus {
  IN_PROGRESS,
  FOR_REVIEW,
}
