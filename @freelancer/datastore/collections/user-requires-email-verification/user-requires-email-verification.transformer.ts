import { UserRequiresEmailVerificationResultAjax } from './user-requires-email-verification.backend-model';
import { UserRequiresEmailVerification } from './user-requires-email-verification.model';

export function transformUserRequiresEmailVerification(
  userRequiresEmailVerificationResultAjax: UserRequiresEmailVerificationResultAjax,
  authUid: string,
): UserRequiresEmailVerification {
  return {
    id: authUid,
    userRequiresEmailVerification:
      userRequiresEmailVerificationResultAjax.userRequiresEmailVerification,
  };
}
