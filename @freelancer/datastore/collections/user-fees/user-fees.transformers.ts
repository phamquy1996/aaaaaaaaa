import { UserFeesApi } from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import { UserFees } from './user-fees.model';

export function transformUserFees(userFees: UserFeesApi): UserFees {
  if (
    !userFees.currency ||
    userFees.tax_type === undefined ||
    userFees.freelancer_verified_price === undefined
  ) {
    throw new ReferenceError(`Missing a required user fees field.`);
  }

  return {
    id: userFees.currency.id,
    currency: transformCurrency(userFees.currency),
    currencyId: userFees.currency.id,
    taxType: userFees.tax_type,
    freelancerVerifiedPrice: userFees.freelancer_verified_price,
  };
}
