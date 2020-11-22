import { isDefined } from '@freelancer/utils';
import { TeamApi } from 'api-typings/users/users';
import { Team } from './teams.model';

export function transformTeam(team: TeamApi): Team {
  if (
    !team.id ||
    !team.owner_user_id ||
    !team.members ||
    !team.name ||
    team.members.find(member => member.user_id === undefined)
  ) {
    throw new ReferenceError(`Missing a required team field.`);
  }

  return {
    id: team.id,
    ownerUserId: team.owner_user_id,
    members: team.members
      .map(teamMember => teamMember.user_id)
      .filter(isDefined),
    name: team.name,
  };
}
