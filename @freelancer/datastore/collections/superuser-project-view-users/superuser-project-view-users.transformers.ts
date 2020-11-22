import { UserApi } from 'api-typings/users/users';
import { transformProjectViewUsers } from '../project-view-users/project-view-users.transformers';
import { SuperuserProjectViewUser } from './superuser-project-view-users.model';

export function transformSuperuserProjectViewUsers(
  superuserUsers: UserApi,
): SuperuserProjectViewUser {
  return {
    ...transformProjectViewUsers(superuserUsers),
    email: superuserUsers.email,
    firstName: superuserUsers.first_name,
    lastName: superuserUsers.last_name,
  };
}
