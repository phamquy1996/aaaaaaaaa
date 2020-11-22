import { DepositFeeConfigApi } from 'api-typings/common/common';
import { DepositFee } from './deposit-fees.model';

export function transformDepositFee(
  depositFeeConfigs: DepositFeeConfigApi,
): DepositFee {
  return {
    id: depositFeeConfigs.currency_id,
    minAmount: depositFeeConfigs.min_amount,
    maxAmount: depositFeeConfigs.max_amount,
    depositMethod: depositFeeConfigs.deposit_method,
    feeFixedAmount: depositFeeConfigs.fee_fixed_amount,
    feeRate: depositFeeConfigs.fee_rate,
  };
}
