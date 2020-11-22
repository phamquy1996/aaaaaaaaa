import { TaxApi } from 'api-typings/payments/payments';
import { Tax } from './tax.model';

export function transformTax(tax: TaxApi, userId: string): Tax {
  if (tax.eligible === undefined) {
    throw Error(`Tax object does not have eligible attribute`);
  }
  return {
    name: tax.name ? tax.name : '',
    rate: tax.rate ? tax.rate : 0,
    eligible: tax.eligible,
    id: userId, // maybe this should be a number
  };
}
