import { UserApi } from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { transformLocation } from '../users/users-location.transformers';
import { transformUserImage } from '../users/users.transformers';
import { CategoryPageViewUser } from './category-page-view-users.model';

export function transformCategoryPageViewUsers(
  user: UserApi,
): CategoryPageViewUser {
  if (!user.id) {
    throw new ReferenceError('Missing a required user field.');
  }

  const publicName: string =
    user.support_status && user.support_status.short_name
      ? user.support_status.short_name
      : user.public_name || user.display_name || user.username;

  return {
    avatar: user.avatar_cdn ? transformUserImage(user.avatar_cdn) : undefined,
    hourlyRate: user.hourly_rate,
    id: user.id,
    skills: (user.jobs || []).map(transformSkill),
    location: user.location ? transformLocation(user.location) : undefined,
    primaryCurrency: user.primary_currency
      ? transformCurrency(user.primary_currency)
      : undefined,
    profileUrl: `/u/${user.username}`,
    publicName,
    username: user.username,
    closed: user.closed,
    jobs: user.jobs,
  };
}
