import { WebsocketRequestMilestoneEvent } from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import {
  MilestoneRequestApi,
  MilestoneRequestStatusApi,
} from 'api-typings/projects/projects';
import { transformCurrency } from '../currencies/currencies.transformers';
import { MilestoneRequest } from './milestone-requests.model';

export function transformMilestoneRequest(
  milestoneRequest: MilestoneRequestApi,
): MilestoneRequest {
  // These are a quick check for Thrift definitions returning an optional
  // parameter on the MilestoneRequestApi.
  if (!milestoneRequest.project_id) {
    throw Error(`Milestone request doesn't have a project ID.`);
  }

  if (
    !milestoneRequest.bidder_id ||
    !milestoneRequest.bid_id ||
    !milestoneRequest.amount
  ) {
    throw Error(`Milestone request is missing a required field.`);
  }

  return {
    // TODO fix the id thing - probably just change the api type;
    id: milestoneRequest.id || Math.random(),
    bidderId: milestoneRequest.bidder_id,
    bidId: milestoneRequest.bid_id,
    timeRequested: milestoneRequest.time_requested
      ? milestoneRequest.time_requested * 1000
      : undefined,
    amount: milestoneRequest.amount,
    projectOwnerId: milestoneRequest.project_owner_id,
    projectId: milestoneRequest.project_id,
    description: milestoneRequest.description,
    currency: milestoneRequest.currency
      ? transformCurrency(milestoneRequest.currency)
      : undefined,
    status: milestoneRequest.status,
    requesterId: milestoneRequest.requester_id,
  };
}

export function transformMilestoneRequestWebsocketEvent(
  body: WebsocketRequestMilestoneEvent,
): MilestoneRequest {
  return {
    id: toNumber(body.data.requestId),
    bidderId: toNumber(body.data.sellerId),
    bidId: toNumber(body.data.bidId),
    timeRequested: body.timestamp * 1000,
    amount: toNumber(body.data.amount),
    projectOwnerId: toNumber(body.data.accountId),
    projectId: toNumber(body.data.id),
    description: body.data.description,
    currency: {
      code: body.data.currencyCode,
      id: toNumber(body.data.currencyId),
      sign: body.data.currencySign,
    },
    status: MilestoneRequestStatusApi.PENDING,
  };
}
