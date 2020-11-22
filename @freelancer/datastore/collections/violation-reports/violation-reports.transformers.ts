import { toNumber } from '@freelancer/utils';
import { ViolationReportApi } from 'api-typings/users/users';
import { ViolationReport } from './violation-reports.model';

export function transformViolationReports(
  violationReport: ViolationReportApi,
): ViolationReport {
  return {
    comments: violationReport.comments,
    id: violationReport.id,
    contextId: toNumber(violationReport.context_id),
    contextType: violationReport.context_type,
    reason: violationReport.reason,
    url: violationReport.url || '',
    violatorUserId: toNumber(violationReport.violator_user_id),
  };
}
