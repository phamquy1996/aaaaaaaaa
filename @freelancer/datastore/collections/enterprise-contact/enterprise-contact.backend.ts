import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RequestBodyType } from '../../../../../projects/e2e-common/src/api-helpers/common';
import { EnterpriseContactCollection } from './enterprise-contact.types';

export function enterpriseContactBackend(): Backend<
  EnterpriseContactCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, enterpriseContact) => ({
      asFormData: true,
      endpoint: 'enterprise/enquiry.php',
      bodyType: RequestBodyType.FORM_DATA,
      isGaf: true,
      payload: {
        first_name: enterpriseContact.firstName,
        last_name: enterpriseContact.lastName,
        company_name: enterpriseContact.companyName,
        email: enterpriseContact.email,
        contact_number: enterpriseContact.contactNumber,
        company_size: enterpriseContact.companySize,
        country: enterpriseContact.country,
        enquiry: enterpriseContact.enquiry,
        captcha_response: enterpriseContact.captchaResponse,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
