import { HiremeCounterofferAjax } from './hireme-counteroffers.backend-model';
import { HiremeCounteroffer } from './hireme-counteroffers.model';

export function transformHiremeCounteroffer(
  hiremeCounteroffer: HiremeCounterofferAjax,
): HiremeCounteroffer {
  return {
    id: hiremeCounteroffer.id,
    bidId: hiremeCounteroffer.bidID,
    comment: hiremeCounteroffer.comment,
    status: hiremeCounteroffer.status,
    newAmount: hiremeCounteroffer.newAmount,
    newPeriod: hiremeCounteroffer.newPeriod,
    submitTime: hiremeCounteroffer.submitTime * 1000,
    updateTime: hiremeCounteroffer.updateTime
      ? hiremeCounteroffer.updateTime * 1000
      : undefined,
  };
}
