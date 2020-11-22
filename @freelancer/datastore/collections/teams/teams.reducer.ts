import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformTeam } from './teams.transformers';
import { TeamsCollection } from './teams.types';

export function teamsReducer(
  state: CollectionStateSlice<TeamsCollection> = {},
  action: CollectionActions<TeamsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'teams') {
        const { result, ref, order } = action.payload;
        if (result.teams) {
          return mergeDocuments<TeamsCollection>(
            state,
            transformIntoDocuments(result.teams, transformTeam),
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
