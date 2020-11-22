import { VerificationFileAjax } from './verification-files.backend-model';
import { VerificationFile } from './verification-files.model';

export function transformVerificationFile(
  verificationFile: VerificationFileAjax,
): VerificationFile {
  return {
    id: verificationFile.id,
    verificationRequestId: verificationFile.verificationRequestId,
    fileId: verificationFile.fileId,
    name: verificationFile.name,
    proofType: verificationFile.proofType,
    source: verificationFile.source,
    date: verificationFile.date * 1000,
  };
}
