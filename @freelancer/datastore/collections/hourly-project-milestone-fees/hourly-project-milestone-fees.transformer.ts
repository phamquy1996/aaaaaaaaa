import { HourlyProjectMilestoneFeesResultAjax } from './hourly-project-milestone-fees.backend-model';
import { HourlyProjectMilestoneFee } from './hourly-project-milestone-fees.model';

export function transformHourlyProjectMilestoneFee(
  result: HourlyProjectMilestoneFeesResultAjax,
): HourlyProjectMilestoneFee {
  return {
    currencyId: result.currencyId,
    fee: parseFloat(result.fee.toFixed(2)),
    id: result.id,
    milestoneAmount: result.milestoneAmount,
    projectId: result.projectId,
  };
}
