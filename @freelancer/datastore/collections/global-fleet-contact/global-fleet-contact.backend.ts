import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RequestBodyType } from '../../../../../projects/e2e-common/src/api-helpers/common';
import { GlobalFleetContactCollection } from './global-fleet-contact.types';

export function globalFleetContactBackend(): Backend<
  GlobalFleetContactCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, globalFleetContact) => ({
      asFormData: true,
      endpoint: 'enterprise/enquiry.php',
      bodyType: RequestBodyType.FORM_DATA,
      isGaf: true,
      payload: {
        first_name: globalFleetContact.firstName,
        last_name: globalFleetContact.lastName,
        company_name: globalFleetContact.companyName,
        email: globalFleetContact.email,
        contact_number: globalFleetContact.contactNumber,
        company_size: globalFleetContact.companySize,
        country: globalFleetContact.country,
        enquiry: globalFleetContact.enquiry,
        captcha_response: globalFleetContact.captchaResponse,
        source: 'globalfleet',
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
