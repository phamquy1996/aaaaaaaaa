import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import {
  MilestoneRequestAction,
  MilestoneRequestActionRawPayload,
  MilestoneRequestUpdateActionRawPayload,
} from './milestone-requests.backend-model';
import { MilestoneRequestsCollection } from './milestone-requests.types';

export function milestoneRequestsBackend(): Backend<
  MilestoneRequestsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    }, // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/milestone_requests`,
      params: {
        bids: getQueryParamValue(query, 'bidId'),
        projects: getQueryParamValue(query, 'projectId'),
        statuses: getQueryParamValue(query, 'status'),
        bidders: getQueryParamValue(query, 'bidderId'),
        milestone_requests: ids,
      },
    }),
    push: (_, milestoneRequest) => ({
      endpoint: `projects/0.1/milestone_requests`,
      payload: {
        project_id: milestoneRequest.projectId,
        bid_id: milestoneRequest.bidId,
        description: milestoneRequest.description,
        amount: milestoneRequest.amount,
      },
    }),
    set: undefined,
    update: (authUid, request, originalRequest) => {
      let payload:
        | MilestoneRequestUpdateActionRawPayload
        | MilestoneRequestActionRawPayload
        | undefined;
      let method: 'PUT' | 'POST' = 'PUT';
      let isGaf = false;
      let asFormData = false;
      let endpoint: string | undefined;

      if (
        originalRequest.projectId &&
        originalRequest.bidId &&
        request.description &&
        request.amount
      ) {
        if (payload) {
          throw new Error('Cannot update two requests at once');
        }
        endpoint = `payment/onRequestMilestone.php`;
        payload = {
          projectId: originalRequest.projectId,
          bidId: originalRequest.bidId,
          id: originalRequest.id, // original milestone request id to update
          description: request.description,
          amount: request.amount,
        };
        method = 'POST';
        isGaf = true;
        asFormData = true;
      }

      // if there's an action, it must be a PUT for milestone requests
      if (request.action) {
        if (payload) {
          throw new Error('Cannot update two requests at once');
        }
        endpoint = `projects/0.1/milestone_requests/${originalRequest.id}`;
        payload = { action: request.action };
        method = 'PUT';
      }

      if (
        payload === undefined ||
        endpoint === undefined ||
        isGaf === undefined ||
        asFormData === undefined
      ) {
        throw new Error('Could not update due to missing field(s)');
      }
      return { asFormData, payload, endpoint, method, isGaf };
    },
    remove: (authUid, id, originalDocument) => {
      const payload: MilestoneRequestActionRawPayload = {
        action: MilestoneRequestAction.DELETE,
      };
      return {
        payload,
        endpoint: `projects/0.1/milestone_requests/${id}`,
        method: 'PUT',
      };
    },
  };
}
