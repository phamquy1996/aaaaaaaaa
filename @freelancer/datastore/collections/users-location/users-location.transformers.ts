import { UserApi } from 'api-typings/users/users';
import { transformLocation } from '../users/users-location.transformers';
import { UsersLocation } from './users-location.model';

export function transformUsersLocation(userApi: UserApi): UsersLocation {
  if (!userApi.location) {
    throw new Error('Location is a required field.');
  }

  return {
    id: userApi.id,
    location: transformLocation(userApi.location),
  };
}
