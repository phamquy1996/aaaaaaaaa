import { DepositPageMethodApi } from 'api-typings/common/common';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformDepositFee } from '../deposit-fees/deposit-fees.transformers';
import { UserDepositMethod } from './user-deposit-methods.model';

export function transformUserDepositMethod(
  userDepositMethod: DepositPageMethodApi,
  userId: number,
): UserDepositMethod {
  return {
    id: userDepositMethod.id,
    name: userDepositMethod.name,
    defaultCurrency: transformCurrency(userDepositMethod.default_currency),
    depositFees: userDepositMethod.deposit_fee_configs.map(config =>
      transformDepositFee(config),
    ),
    nativeCharge: userDepositMethod.native_charge,
    renderingPriority: userDepositMethod.rendering_priority,
    instantPayment: userDepositMethod.instant_payment,
    userId,
  };
}
