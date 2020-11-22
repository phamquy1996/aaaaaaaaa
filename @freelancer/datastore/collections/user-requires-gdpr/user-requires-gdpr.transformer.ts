import { UserRequiresGdprResultAjax } from './user-requires-gdpr.backend-model';
import { UserRequiresGdpr } from './user-requires-gdpr.model';

export function transformUserRequiresGdpr(
  userRequiresGdprResultAjax: UserRequiresGdprResultAjax,
  authUid: string,
): UserRequiresGdpr {
  return {
    id: authUid,
    userRequiresGdpr: userRequiresGdprResultAjax.userRequiresGdpr,
  };
}
