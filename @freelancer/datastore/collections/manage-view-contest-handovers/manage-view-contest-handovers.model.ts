import {
  HandoversGetResultApi,
  HandoverUserRoleApi,
} from 'api-typings/contests/contests';
import { ContestHandover } from '../contest-handovers/contest-handovers.model';
import { BaseUser } from '../users/users.model';

/**
 * This collection fetches from contests/0.1/handovers and is specifically
 * used for Manage Contest Awarded and Released Tables.
 */
export type ManageViewContestHandover =
  | (ContestHandover & {
      readonly role: HandoverUserRoleApi.BUYER;
      readonly sellerDetails: BaseUser;
      readonly handoverStatus?: ManageContestHandoverStatus;
    })
  | (ContestHandover & {
      readonly role: HandoverUserRoleApi.SELLER;
      readonly buyerDetails: BaseUser;
      readonly handoverStatus?: ManageContestHandoverStatus;
    });

export type ManageViewContestHandoverContext = HandoversGetResultApi & {
  readonly role: HandoverUserRoleApi;
};

export enum ManageContestHandoverStatus {
  IN_PROGRESS,
  FOR_REVIEW,
}
