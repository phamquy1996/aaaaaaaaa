import { WebsocketMilestone } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { MilestoneApi } from 'api-typings/projects/projects';
import {
  transformCurrency,
  transformCurrencyAjax,
} from '../currencies/currencies.transformers';
import { Milestone } from './milestones.model';

export function transformMilestone(milestone: MilestoneApi): Milestone {
  if (!milestone.project_id) {
    throw Error(`Milestone request doesn't have a project ID.`);
  }
  if (!milestone.time_created) {
    throw Error(`Milestone request doesn't have a time created.`);
  }

  return {
    // TODO fix the id thing - probably just change the api type;
    id: milestone.transaction_id || Math.random(),
    projectOwnerId: milestone.project_owner_id,
    bidderId: milestone.bidder_id,
    amount: milestone.amount,
    reason: milestone.reason,
    description: milestone.other_reason,
    projectId: milestone.project_id,
    bidId: milestone.bid_id,
    currency: milestone.currency
      ? transformCurrency(milestone.currency)
      : undefined,
    isFromPrepaid: milestone.is_from_prepaid,
    status: milestone.status,
    // TODO: remove toNumber when T77283 is fixed
    disputeId: toNumber(milestone.dispute_id),
    cancellationRequested: milestone.cancellation_requested,
    timeCreated: milestone.time_created * 1000,
    actionReason: milestone.cancellation_reason,
    actionReasonText: milestone.reason_text,
    timeReleased: milestone.time_released
      ? milestone.time_released * 1000
      : undefined,
    isInitialPayment: milestone.is_initial_payment,
  };
}

export function transformWebsocketMilestone(
  milestone: WebsocketMilestone,
): Milestone {
  if (!milestone.project_id) {
    throw Error(`Milestone doesn't have a project ID.`);
  }
  if (milestone.time_created === undefined) {
    throw Error(`Milestone doesn't have a time created.`);
  }

  return {
    id:
      milestone.transaction_id && typeof milestone.transaction_id === 'number'
        ? toNumber(milestone.transaction_id)
        : Math.random(),
    projectOwnerId: toNumber(milestone.project_owner_id),
    bidderId: toNumber(milestone.bidder_id),
    amount: toNumber(milestone.amount),
    reason: milestone.reason,
    description: milestone.other_reason,
    projectId: toNumber(milestone.project_id),
    bidId: toNumber(milestone.bid_id),
    currency: milestone.currency
      ? transformCurrencyAjax(milestone.currency)
      : undefined,
    isFromPrepaid: milestone.is_from_prepaid,
    status: milestone.status,
    disputeId: toNumber(milestone.dispute_id),
    timeCreated:
      typeof milestone.time_created === 'string'
        ? toNumber(milestone.time_created) * 1000
        : Date.now(),
    isInitialPayment: milestone.is_initial_payment,
  };
}
