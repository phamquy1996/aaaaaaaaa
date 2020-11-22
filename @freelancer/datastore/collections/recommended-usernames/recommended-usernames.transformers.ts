import { RecommendedUsername } from './recommended-usernames.model';

export function transformRecommendedUsernames(
  username: string,
  email: string,
): RecommendedUsername {
  return {
    id: `${email}-${username}`,
    email,
    username,
  };
}
