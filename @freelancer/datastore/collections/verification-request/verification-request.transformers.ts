import { toNumber } from '@freelancer/utils';
import { transformVerificationAddressDocumentTypes } from '../verification-address-document-types/verification-address-document-types.transformers';
import { transformVerificationIdType } from '../verification-id-types/verification-id-types.transformers';
import {
  KYCRequestAjax,
  RejectReasonAjax,
  VerificationAddressDetailsAjax,
  VerificationIDDetailsAjax,
  VerificationKeycodeDetailsAjax,
  VerificationRequestAjax,
} from './verification-request.backend-model';
import {
  DateLabel,
  UNSUPPORTED_VERIFICATION_STATUSES,
  VerificationRequest,
} from './verification-request.model';

export function transformVerificationRequest(
  verificationRequest: VerificationRequestAjax,
): VerificationRequest {
  const request = verificationRequest.details;

  const isSupportedVerificationType = !UNSUPPORTED_VERIFICATION_STATUSES.find(
    status => status === verificationRequest.status,
  );

  return {
    id: toNumber(verificationRequest.id),
    userId: verificationRequest.userId,
    status: verificationRequest.status,
    // Transform if it's a valid KYC request. Otherwise, it only has the countryCode.
    details: isSupportedVerificationType
      ? transformVerificationRequestDetails(request)
      : { countryCode: request.countryCode },
  };
}

export function transformVerificationIDDetails(
  idDetails: VerificationIDDetailsAjax,
) {
  return {
    birthDate: transformDateLabel(idDetails.date_of_birth),
    firstName: idDetails.first_name,
    idNumber: idDetails.id_number,
    idIssuingCountry: idDetails.id_country,
    idExpiryDate: transformDateLabel(idDetails.id_expiry),
    idType:
      idDetails.id_type && idDetails.id_country
        ? transformVerificationIdType(idDetails.id_type, idDetails.id_country)
        : undefined,
    lastName: idDetails.last_name,
    rejectReasons: transformRejectReasons(idDetails.rejectReasons),
    status: toNumber(idDetails.status),
  };
}

export function transformVerificationAddressDetails(
  addressDetails: VerificationAddressDetailsAjax,
) {
  return {
    addressOne: addressDetails.address_1,
    addressTwo: addressDetails.address_2,
    city: addressDetails.city,
    country: addressDetails.country,
    dateIssued: transformDateLabel(addressDetails.doc1_issue_date),
    institutionName: addressDetails.doc1_issuing_authority,
    documentType:
      addressDetails.doc1_type && addressDetails.country
        ? transformVerificationAddressDocumentTypes(
            addressDetails.doc1_type,
            addressDetails.country,
          )
        : undefined,
    postalCode: addressDetails.post_code,
    rejectReasons: transformRejectReasons(addressDetails.rejectReasons),
    state: addressDetails.state,
    status: toNumber(addressDetails.status),
  };
}

export function transformVerificationKeycodeDetails(
  keycodeDetails: VerificationKeycodeDetailsAjax,
) {
  return {
    keycode: keycodeDetails.keycode,
    rejectReasons: transformRejectReasons(keycodeDetails.rejectReasons),
    status: toNumber(keycodeDetails.status),
  };
}

export function transformVerificationRequestDetails(details: KYCRequestAjax) {
  return {
    idDetails: details.idDetails
      ? transformVerificationIDDetails(details.idDetails)
      : undefined,
    keycodeDetails: details.keycodeDetails
      ? transformVerificationKeycodeDetails(details.keycodeDetails)
      : undefined,
    addressDetails: details.addressDetails
      ? transformVerificationAddressDetails(details.addressDetails)
      : undefined,
    countryCode: details.countryCode,
  };
}

export function transformDateLabel(date?: DateLabel) {
  return date ? { ...date, month: date.month - 1 } : undefined;
}

export function transformRejectReasons(
  rejectReasons?: ReadonlyArray<RejectReasonAjax>,
) {
  if (!rejectReasons) {
    return undefined;
  }

  return rejectReasons.length > 0
    ? rejectReasons.map(reason => ({
        description: reason.description,
        id: toNumber(reason.id),
        limitAccountDocSubmissionId: toNumber(
          reason.limit_account_doc_submission_id,
        ),
        limitAccountRejectReasonTagId: toNumber(
          reason.limit_account_reject_reason_tag_id,
        ),
        name: reason.name,
      }))
    : [];
}
