/**
 * Data model for files used in verifying a user's identity.
 */
export interface VerificationFile {
  readonly id: number;
  readonly verificationRequestId: number;
  readonly fileId: number;
  readonly name: string;
  readonly proofType: VerificationProofType;
  readonly source: VerificationFileSource;
  readonly date: number;
}

export enum VerificationFileSource {
  DESKTOP_FILE = 'desktop_file',
  DESKTOP_CAMERA = 'desktop_camera',
}

export enum VerificationProofType {
  TYPE_PROOF_ID = 1,
  TYPE_PROOF_ADDR,
  TYPE_PROOF_KEYCODE,
}
