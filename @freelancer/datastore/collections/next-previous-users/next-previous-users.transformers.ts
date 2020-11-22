import { NextPreviousUsersCollectionBackendModel } from './next-previous-users.backend-model';
import { NextPreviousUsers } from './next-previous-users.model';

export function transformNextPreviousUsers(
  result: NextPreviousUsersCollectionBackendModel,
): NextPreviousUsers {
  return {
    id: result.id,
    previousUsername: result.users.previousUsername,
    nextUsername: result.users.nextUsername,
  };
}
