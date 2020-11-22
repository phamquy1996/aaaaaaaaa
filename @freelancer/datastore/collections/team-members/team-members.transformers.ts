import { fromPairs } from '@freelancer/utils';
import { TeamMemberApi } from 'api-typings/users/users';
import { TeamMember } from './team-members.model';

export function transformTeamMember(
  teamMember: TeamMemberApi,
  teamId: number | undefined,
): TeamMember {
  if (
    !teamMember.id ||
    !teamId ||
    !teamMember.user_id ||
    !teamMember.role ||
    !teamMember.permissions ||
    typeof teamMember.is_deleted === 'undefined'
  ) {
    throw new ReferenceError(`Missing a required team member field.`);
  }

  // For permissions with value of undefined, turn them into false
  const permissions = fromPairs(
    Object.entries(teamMember.permissions).map(([permission, value]) => [
      permission,
      value || false,
    ]),
  );

  return {
    id: teamMember.id,
    teamId,
    userId: teamMember.user_id,
    description: teamMember.description,
    role: teamMember.role,
    permissions,
    isDeleted: teamMember.is_deleted || false,
    accessToken: teamMember.access_token,
    lastUpdated: teamMember.last_updated
      ? teamMember.last_updated * 1000
      : undefined, // Convert to milliseconds
    joined: teamMember.joined ? teamMember.joined * 1000 : undefined, // Convert to milliseconds
  };
}
