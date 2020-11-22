import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformContestViewContest } from './contest-view-contests.transformers';
import { ContestViewContestsCollection } from './contest-view-contests.types';

export function contestViewContestsReducer(
  state: CollectionStateSlice<ContestViewContestsCollection> = {},
  action: CollectionActions<ContestViewContestsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contestViewContests') {
        const { result, ref, order } = action.payload;
        if (result.contests) {
          return mergeDocuments<ContestViewContestsCollection>(
            state,
            transformIntoDocuments(
              result.contests,
              transformContestViewContest,
            ),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contestViewContests') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<ContestViewContestsCollection>(
          state,
          transformIntoDocuments([result], transformContestViewContest),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'contestViewContests') {
        const { delta, originalDocument, ref } = action.payload;
        const contestId = originalDocument.id.toString();
        const contest = pluckDocumentFromRawStoreCollectionState(
          state,
          ref.path,
          contestId,
        );
        if (!contest) {
          throw new Error('Contest being updated is missing in the store');
        }
        return mergeWebsocketDocuments<ContestViewContestsCollection>(
          state,
          transformIntoDocuments([contestId], () => deepSpread(contest, delta)),
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
