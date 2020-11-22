import { UserApi } from 'api-typings/users/users';
import { SearchContestEntrantEntry } from './search-contest-entrants.model';

export function transformSearchContestEntrant(
  searchContestEntrant: UserApi,
): SearchContestEntrantEntry {
  if (!searchContestEntrant.public_name) {
    throw new ReferenceError('Missing public_name field for user');
  }

  return {
    id: searchContestEntrant.id,
    username: searchContestEntrant.username,
    publicName: searchContestEntrant.public_name,
  };
}
