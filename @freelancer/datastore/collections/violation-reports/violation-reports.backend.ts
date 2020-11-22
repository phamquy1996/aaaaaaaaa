import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ViolationReportsCollection } from './violation-reports.types';

export function violationReportsBackend(): Backend<ViolationReportsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, report) => ({
      endpoint: 'users/0.1/violation_reports/',
      payload: {
        context_id: report.contextId,
        context_type: report.contextType,
        violator_user_id: report.violatorUserId,
        additional_reason: report.additionalReason,
        reason: report.reason,
        url: report.url,
        comments: report.comments,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
