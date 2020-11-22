import { VerificationAddressDocumentTypesAjax } from './verification-address-document-types.backend-model';
import { VerificationAddressDocumentType } from './verification-address-document-types.model';

export function transformVerificationAddressDocumentTypes(
  verificationAddressDocumentTypes: VerificationAddressDocumentTypesAjax,
  countryCode: string,
): VerificationAddressDocumentType {
  return {
    id: `${verificationAddressDocumentTypes.id}-${countryCode}`,
    backendId: verificationAddressDocumentTypes.id,
    countryCode,
    name: verificationAddressDocumentTypes.name,
  };
}
