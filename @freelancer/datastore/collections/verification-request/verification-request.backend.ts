import {
  Backend,
  OrderByDirection,
  RecursivePartial,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import {
  VerificationAddressDetailsUpdatePayload,
  VerificationIDDetailsUpdatePayload,
} from './verification-request.backend-model';
import {
  VerificationAddressDetails,
  VerificationIDDetails,
  VerificationRequest,
  VerificationRequestStatus,
} from './verification-request.model';
import { VerificationRequestCollection } from './verification-request.types';

export function verificationRequestBackend(): Backend<
  VerificationRequestCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'verification/getVerificationRequest.php',
      isGaf: true,
      params: {},
    }),
    push: (authUid, verificationRequest) => {
      const { details } = verificationRequest;

      if (!details || !details.countryCode) {
        throw new Error('Invalid verification request');
      }

      return {
        endpoint: 'verification/createVerificationRequest.php',
        asFormData: true,
        payload: {
          countryCode: details.countryCode,
        },
        isGaf: true,
      };
    },
    set: (authUid, verificationRequest) => {
      const { details } = verificationRequest;

      if (!details || !details.countryCode) {
        throw new Error('Invalid verification request');
      }

      return {
        endpoint: 'verification/createVerificationRequest.php',
        asFormData: true,
        payload: {
          countryCode: details.countryCode,
        },
        isGaf: true,
      };
    },
    update: (
      authUid: string,
      verificationRequestDelta: RecursivePartial<VerificationRequest>,
    ) => {
      const { status, details } = verificationRequestDelta;

      if (status === VerificationRequestStatus.STATUS_KYC_PENDING) {
        return {
          endpoint: 'verification/submitVerificationRequest.php',
          isGaf: true,
          method: 'PUT',
          payload: undefined,
        };
      }

      if (!details) {
        throw new Error('Invalid parameters');
      }

      if (details.idDetails) {
        return {
          endpoint: 'verification/saveIdDetails.php',
          method: 'PUT',
          isGaf: true,
          asFormData: false,
          payload: getIdDetailsPayload(details.idDetails),
        };
      }

      if (details.keycodeDetails) {
        return {
          endpoint: 'verification/saveKeycodeDetails.php',
          method: 'PUT',
          isGaf: true,
          payload: undefined,
        };
      }

      if (details.addressDetails) {
        return {
          endpoint: 'verification/saveAddressDetails.php',
          method: 'PUT',
          isGaf: true,
          asFormData: false,
          payload: getAddressDetailsPayload(details.addressDetails),
        };
      }

      throw new Error('Unsupported update payload');
    },
    remove: undefined, // FIXME: Why does this have a reducer for delete?
  };
}
function getIdDetailsPayload(
  details: RecursivePartial<VerificationIDDetails>,
): VerificationIDDetailsUpdatePayload {
  if (
    !details.birthDate ||
    !details.birthDate.year ||
    !isDefined(details.birthDate.month) ||
    !details.birthDate.day ||
    !details.idIssuingCountry ||
    !details.idType ||
    !details.idType.id ||
    !details.idType.backendId ||
    (details.idType.hasExpiryDate &&
      (!details.idExpiryDate ||
        !details.idExpiryDate.year ||
        !isDefined(details.idExpiryDate.month) ||
        !details.idExpiryDate.day)) ||
    !details.firstName ||
    !details.lastName ||
    !details.idNumber
  ) {
    throw new Error('Invalid parameters');
  }

  const {
    year: birthYear,
    month: birthMonth,
    day: birthDay,
  } = details.birthDate;

  let payload: VerificationIDDetailsUpdatePayload = {
    idCountry: details.idIssuingCountry,
    idType: details.idType.backendId,
    firstName: details.firstName,
    lastName: details.lastName,
    birthYear,
    birthMonth,
    birthDay,
    idNumber: details.idNumber,
  };

  if (details.idExpiryDate) {
    const {
      year: idExpiryYear,
      month: idExpiryMonth,
      day: idExpiryDay,
    } = details.idExpiryDate;
    payload = {
      ...payload,
      idExpiryYear,
      idExpiryMonth,
      idExpiryDay,
    };
  }

  return payload;
}

function getAddressDetailsPayload(
  details: RecursivePartial<VerificationAddressDetails>,
): VerificationAddressDetailsUpdatePayload {
  if (
    !details.addressOne ||
    !details.city ||
    !details.state ||
    !details.postalCode ||
    !details.country ||
    (details.documentType && (!details.dateIssued || !details.institutionName))
  ) {
    throw new Error('Invalid parameters');
  }

  let payload: VerificationAddressDetailsUpdatePayload = {
    address1: details.addressOne,
    address2: details.addressTwo,
    city: details.city,
    state: details.state,
    postalCode: details.postalCode,
    country: details.country,
    useIDFile: details.documentType ? 'false' : 'true',
  };

  if (details.documentType && details.dateIssued) {
    const {
      year: dateIssuedYear,
      month: dateIssuedMonth,
      day: dateIssuedDay,
    } = details.dateIssued;
    payload = {
      ...payload,
      documentType: details.documentType.backendId,
      dateIssuedYear,
      dateIssuedMonth,
      dateIssuedDay,
      institutionName: details.institutionName,
    };
  }
  return payload;
}
