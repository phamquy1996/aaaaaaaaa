import { VerificationIdTypeAjax } from './verification-id-types.backend-model';
import { VerificationIdType } from './verification-id-types.model';

export function transformVerificationIdType(
  verificationIdType: VerificationIdTypeAjax,
  countryCode: string,
): VerificationIdType {
  return {
    id: `${verificationIdType.id}-${countryCode}`,
    backendId: verificationIdType.id,
    name: verificationIdType.name,
    hasExpiryDate: !!verificationIdType.expiryDate,
    countryCode,
  };
}
