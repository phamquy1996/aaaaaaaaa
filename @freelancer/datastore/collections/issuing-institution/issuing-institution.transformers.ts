import { IinGetResultApi } from 'api-typings/payments/payments';
import { transformCurrency } from '../currencies/currencies.transformers';
import { IssuingInstitution } from './issuing-institution.model';

export function transformIssuingInstitution(
  issuingInstitution: IinGetResultApi,
): IssuingInstitution {
  if (!issuingInstitution.brand) {
    throw new ReferenceError(`Missing required brand field.`);
  } else if (!issuingInstitution.country) {
    throw new ReferenceError(`Missing required country field.`);
  }
  return {
    id: issuingInstitution.bin,
    bank: issuingInstitution.bank,
    bin: issuingInstitution.bin,
    brand: issuingInstitution.brand,
    cardCategory: issuingInstitution.card_category,
    cardType: issuingInstitution.card_type,
    countryCode: issuingInstitution.country,
    currency: issuingInstitution.currency
      ? transformCurrency(issuingInstitution.currency)
      : undefined,
    subBrand: issuingInstitution.sub_brand,
    updatedTime: issuingInstitution.updated_time
      ? issuingInstitution.updated_time * 1000
      : undefined,
  };
}
