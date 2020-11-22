import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTeamMember } from './team-members.transformers';
import { TeamMembersCollection } from './team-members.types';

export function teamMembersReducer(
  state: CollectionStateSlice<TeamMembersCollection> = {},
  action: CollectionActions<TeamMembersCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'teamMembers') {
        const { result, ref, order } = action.payload;
        if (result.team && result.team.members) {
          return mergeDocuments<TeamMembersCollection>(
            state,
            transformIntoDocuments(
              result.team.members,
              transformTeamMember,
              result.team.id,
            ),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }

    default:
      return state;
  }
}
