import { VerificationAddressDocumentType } from '../verification-address-document-types/verification-address-document-types.model';
import { VerificationIdType } from '../verification-id-types/verification-id-types.model';

/** Request for verification center */
export interface VerificationRequest {
  readonly id: number;
  readonly userId: number;
  readonly status: VerificationRequestStatus;
  readonly details: KYCRequest;
}

export interface KYCRequest {
  readonly idDetails?: VerificationIDDetails;
  readonly keycodeDetails?: VerificationKeycodeDetails;
  readonly addressDetails?: VerificationAddressDetails;
  readonly countryCode: string;
}

export interface VerificationIDDetails {
  readonly birthDate?: DateLabel;
  readonly firstName?: string;
  readonly idNumber?: string;
  readonly idIssuingCountry?: string;
  readonly idExpiryDate?: DateLabel;
  readonly idType?: VerificationIdType;
  readonly lastName?: string;
  readonly rejectReasons?: ReadonlyArray<RejectReason>;
  readonly status: VerificationDetailStatus;
}

export interface VerificationKeycodeDetails {
  readonly keycode: string;
  readonly rejectReasons?: ReadonlyArray<RejectReason>;
  readonly status: VerificationDetailStatus;
}

export interface VerificationAddressDetails {
  readonly addressOne?: string;
  readonly addressTwo?: string;
  readonly city?: string;
  readonly dateIssued?: DateLabel;
  readonly country?: string;
  readonly institutionName?: string;
  readonly documentType?: VerificationAddressDocumentType;
  readonly postalCode?: string;
  readonly rejectReasons?: ReadonlyArray<RejectReason>;
  readonly state?: string;
  readonly status: VerificationDetailStatus;
}

export interface DateLabel {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface RejectReason {
  readonly description: string;
  readonly id?: number;
  readonly limitAccountDocSubmissionId?: number;
  readonly limitAccountRejectReasonTagId?: number;
  readonly name?: string;
}

export enum VerificationRequestStatus {
  STATUS_FORCE_KYC_LIMIT = '0',
  STATUS_REQUEST = '1',
  STATUS_PENDING = '2',
  STATUS_APPROVE = '3',
  STATUS_REJECT = '4',
  STATUS_ID_VERIFY_REQUEST = '5',
  STATUS_ID_VERIFY_PENDING = '6',
  STATUS_ID_VERIFY_APPROVE = '7',
  STATUS_ID_VERIFY_CANCEL = '8',
  STATUS_KYC_REQUEST = '9',
  STATUS_KYC_PENDING = '10',
  STATUS_KYC_APPROVE = '11',
  STATUS_KYC_CANCEL = '12',
  STATUS_CANCEL = '13',
  STATUS_CLAIMED = '14',
  STATUS_KYC_CLAIMED = '15',
  STATUS_ID_VERIFY_CLAIMED = '16',
  STATUS_ADDRESS_VERIFY_ONLY = '100',
  STATUS_CORPORATE_FULL_KYC = '101',
  STATUS_CORPORATE_ONLY_KYC = '102',
  STATUS_CORPORATE_REJECT_KYC = '103',
}

export enum VerificationDetailStatus {
  REQUEST,
  PENDING,
  APPROVED,
  REJECTED,
}

export const UNSUPPORTED_VERIFICATION_STATUSES: ReadonlyArray<VerificationRequestStatus> = [
  VerificationRequestStatus.STATUS_ADDRESS_VERIFY_ONLY,
  VerificationRequestStatus.STATUS_CORPORATE_FULL_KYC,
  VerificationRequestStatus.STATUS_CORPORATE_ONLY_KYC,
  VerificationRequestStatus.STATUS_ID_VERIFY_REQUEST,
  VerificationRequestStatus.STATUS_ID_VERIFY_PENDING,
];
