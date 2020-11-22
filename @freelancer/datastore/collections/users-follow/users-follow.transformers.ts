import { UserFollowApi } from 'api-typings/users/users';
import { UserFollow } from './users-follow.model';

export function transformUsersFollow(userFollowApi: UserFollowApi): UserFollow {
  return {
    id: userFollowApi.followed_user_id,
    status: userFollowApi.status,
    followedUserId: userFollowApi.followed_user_id,
    followedByUserId: userFollowApi.followed_by_user_id,
  };
}
