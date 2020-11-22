import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestPolls } from './contest-polls.transformers';
import { ContestPollsCollection } from './contest-polls.types';

export function contestPollsReducer(
  state: CollectionStateSlice<ContestPollsCollection> = {},
  action: CollectionActions<ContestPollsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestPolls') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<ContestPollsCollection>(
          state,
          transformIntoDocuments(result.polls, transformContestPolls),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
