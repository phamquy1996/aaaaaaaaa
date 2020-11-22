import { UserIsArrowWhitelistedGetResultAjaxApi } from './user-is-arrow-whitelisted.backend-model';
import { UserIsArrowWhitelisted } from './user-is-arrow-whitelisted.model';

export function transformUserIsArrowWhitelisted(
  userIsArrowWhitelisted: UserIsArrowWhitelistedGetResultAjaxApi,
): UserIsArrowWhitelisted {
  return {
    id: userIsArrowWhitelisted.id,
    isWhitelisted: userIsArrowWhitelisted.isWhitelisted,
  };
}
