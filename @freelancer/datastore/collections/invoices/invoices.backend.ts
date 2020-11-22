import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { ProjectInvoiceMilestoneLinkedStatusesApi } from 'api-typings/payments/payments';
import { Invoice } from './invoices.model';
import { InvoicesCollection } from './invoices.types';

export function invoicesBackend(): Backend<InvoicesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      // this endpoint is used when we want to find the invoice ids for the
      // released hourly milestone without feedback
      // the ajax endpoint will only return result for the milestones which
      // have no feedback
      if (getQueryParamValue(query, 'milestoneId').length) {
        return {
          endpoint: 'projects/getHourlyMilestoneInvoicesWithoutFeedback.php',
          isGaf: true,
          params: {
            projectId: getQueryParamValue(query, 'projectId')[0],
            milestoneIds: getQueryParamValue(query, 'milestoneId'),
          },
        };
      }

      return {
        endpoint: 'projects/0.1/invoices',
        isGaf: false,
        params: {
          invoices: ids,
          projects: getQueryParamValue(query, 'projectId'),
          bids: getQueryParamValue(query, 'bidId'),
          freelancers: getQueryParamValue(query, 'freelancerId'),
          employers: getQueryParamValue(query, 'employerId'),
          statuses: getQueryParamValue(query, 'status'),
          milestone_linked_statuses: getMilestoneLinkedStatusParamValue(query),
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getMilestoneLinkedStatusParamValue(
  query: RawQuery<Invoice> | undefined,
) {
  const paramValue = getQueryParamValue(query, 'milestoneLinkedStatus');
  // default to fetching all invoices (linked and unlinked)
  return paramValue.length === 0
    ? [
        ProjectInvoiceMilestoneLinkedStatusesApi.LINKED,
        ProjectInvoiceMilestoneLinkedStatusesApi.UNLINKED,
      ]
    : paramValue;
}
