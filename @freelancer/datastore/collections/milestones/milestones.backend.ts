import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { MilestoneStatusApi } from 'api-typings/projects/projects';
import { MilestoneUpdateActionRawPayload } from './milestones.backend-model';
import { MilestonesCollection } from './milestones.types';

export function milestonesBackend(): Backend<MilestonesCollection> {
  return {
    defaultOrder: {
      field: 'timeCreated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/milestones`,
      params: {
        projects: getQueryParamValue(query, 'projectId'),
        bids: getQueryParamValue(query, 'bidId'),
        bidders: getQueryParamValue(query, 'bidderId'),
        statuses: getQueryParamValue(query, 'status'),
        milestones: ids,
        project_owners: getQueryParamValue(query, 'projectOwnerId'),
        is_initial_payment: getQueryParamValue(query, 'isInitialPayment')[0],
      },
    }),
    push: (_, milestone, extra) => {
      if (extra?.invoiceId === undefined && !milestone.description) {
        throw new Error('Milestone description not provided on push');
      }
      return {
        endpoint: `projects/0.1/milestones/`,
        payload: {
          bidder_id: milestone.bidderId,
          amount: milestone.amount,
          project_id: milestone.projectId,
          // TODO - reason: milestone.reason,
          description: milestone.description || '',
          request_id: extra ? toNumber(extra.requestId) : undefined,
          invoice_id: extra ? toNumber(extra.invoiceId) : undefined,
        },
      };
    },
    set: undefined,
    update: (authUid, milestone, originalMilestone) => {
      const endpoint = `projects/0.1/milestones/${originalMilestone.id}/`;
      const method: 'PUT' | 'POST' = 'PUT';
      let payload: MilestoneUpdateActionRawPayload | undefined;
      const asFormData = false;

      if (
        (originalMilestone.status === MilestoneStatusApi.FROZEN ||
          originalMilestone.status === MilestoneStatusApi.REQUESTED_RELEASE) &&
        milestone.status === MilestoneStatusApi.CLEARED &&
        milestone.amount !== undefined
      ) {
        if (payload) {
          throw new Error('Cannot update two milestones at once, at release');
        }
        payload = { action: 'release', amount: milestone.amount };
      }
      if (
        originalMilestone.status === MilestoneStatusApi.FROZEN &&
        milestone.status === MilestoneStatusApi.REQUESTED_RELEASE
      ) {
        if (payload) {
          throw new Error(
            'Cannot update two milestones at once, at request release',
          );
        }
        payload = { action: 'request_release' };
      }
      if (
        (originalMilestone.status === MilestoneStatusApi.FROZEN ||
          originalMilestone.status === MilestoneStatusApi.REQUESTED_RELEASE ||
          originalMilestone.status === MilestoneStatusApi.PENDING) &&
        milestone.status === MilestoneStatusApi.CANCELED
      ) {
        if (payload) {
          throw new Error('Cannot update two milestones at once, at cancel');
        }
        payload = { action: 'cancel' };
      }
      if (
        originalMilestone.description !== milestone.description &&
        milestone.status !== MilestoneStatusApi.REQUESTED_RELEASE &&
        milestone.status !== MilestoneStatusApi.CLEARED
      ) {
        if (payload) {
          throw new Error('Cannot update two milestones at once, at update');
        }
        payload = { action: 'update', description: milestone.description };
      }
      if (milestone.action === 'request_cancel' && milestone.actionReason) {
        // if it's request_cancel, then override any other previous options
        payload = {
          action: milestone.action,
          reason: milestone.actionReason,
          reason_text:
            milestone.actionReason === 'other'
              ? milestone.actionReasonText
              : '',
        };
      }

      if (
        originalMilestone.cancellationRequested &&
        milestone.cancellationRequested === false
      ) {
        if (payload) {
          throw new Error(
            'Cannot update two milestones at once, at reject cancel',
          );
        }
        payload = { action: 'reject_cancel' };
      }

      if (payload === undefined) {
        throw new Error('Could not update due to missing payload');
      }
      return { asFormData, payload, endpoint, method };
    },
    remove: undefined,
  };
}
