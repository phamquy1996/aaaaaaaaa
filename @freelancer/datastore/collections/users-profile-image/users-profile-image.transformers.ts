import { toNumber } from '@freelancer/utils';
import { ProfileImageInformationApi } from 'api-typings/users/users';
import { UsersProfileImage } from './users-profile-image.model';

export function transformUsersProfileImage(
  usersProfileImage: ProfileImageInformationApi,
  authId: string,
): UsersProfileImage {
  return {
    id: toNumber(authId),
    avatarUrl: usersProfileImage.avatar_url,
    cropParams: usersProfileImage.crop_params,
    rawAvatarUrl: usersProfileImage.raw_avatar_url,
  };
}
