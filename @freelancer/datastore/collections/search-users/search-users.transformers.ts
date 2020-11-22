import { isDefined } from '@freelancer/utils';
import { OnlineOfflineStatusApi, UserApi } from 'api-typings/users/users';
import { transformCountry } from '../countries/countries.transformers';
import { transformProfileViewUsers } from '../profile-view-users/profile-view-users.transformers';
import { transformUserImage } from '../users/users.transformers';
import { SearchUser } from './search-users.model';

export function transformSearchUser(user: UserApi): SearchUser {
  if (!user.reputation || !user.location || !user.location.country) {
    throw new ReferenceError(
      'Missing required fields for search users transformer.',
    );
  }

  return {
    ...transformProfileViewUsers(user),
    avatar: user.avatar_cdn ? transformUserImage(user.avatar_cdn) : undefined,
    country: transformCountry(user.location.country),
    isOnline:
      user.online_offline_status !== undefined &&
      user.online_offline_status.status === OnlineOfflineStatusApi.ONLINE,
    rating: user.reputation.entire_history.overall,
    reviews: user.reputation.entire_history.reviews,
    searchCoordinates:
      isDefined(user.location.latitude) && isDefined(user.location.longitude)
        ? {
            latitude: user.location.latitude,
            longitude: user.location.longitude,
          }
        : undefined,
  };
}
