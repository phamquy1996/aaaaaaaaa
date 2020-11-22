import { toNumber } from '@freelancer/utils';
import { ProjectFeeInfoAjax } from './project-fee-info.backend-model';
import { ProjectFeeInfo } from './project-fee-info.model';

export function transformProjectFeeInfo(
  feeInfo: ProjectFeeInfoAjax,
): ProjectFeeInfo {
  return {
    id: feeInfo.projectId,
    minByRate: feeInfo.min_by_rate,
    rate: feeInfo.rate,
    round: toNumber(feeInfo.round),
    tranType: feeInfo.tran_type,
    discount: feeInfo.discount,
  };
}
