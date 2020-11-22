import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { ContestUpgradeApi } from 'api-typings/contests/contests';
import { ThreadsCollection } from '../threads/threads.types';
import { transformContest } from './contests.transformers';
import { ContestsCollection } from './contests.types';

export function contestsReducer(
  state: CollectionStateSlice<ContestsCollection> = {},
  action:
    | CollectionActions<ContestsCollection>
    | CollectionActions<ThreadsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'contests') {
        const { result, ref, order } = action.payload;
        if (result.contests) {
          return mergeDocuments<ContestsCollection>(
            state,
            transformIntoDocuments(result.contests, transformContest),
            order,
            ref,
          );
        }
        return state;
      }
      if (action.payload.type === 'threads') {
        const contextDetails = action.payload.result.context_details;
        if (!contextDetails || !contextDetails.contests) {
          return state;
        }

        const { ref } = action.payload;

        return mergeWebsocketDocuments<ContestsCollection>(
          state,
          transformIntoDocuments(contextDetails.contests, transformContest),
          { path: { collection: 'contests', authUid: ref.path.authUid } },
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'contests') {
        const { ref, result } = action.payload;

        return mergeWebsocketDocuments<ContestsCollection>(
          state,
          transformIntoDocuments([result], transformContest),
          ref,
        );
      }
      return state;
    }

    case 'WS_MESSAGE': {
      if (action.payload.parent_type === 'notifications') {
        const ref: Reference<ContestsCollection> = {
          path: {
            collection: 'contests',
            authUid: action.payload.toUserId,
          },
        };

        switch (action.payload.type) {
          // This event is sent when a non-draft contest is created
          // or when a draft contest is activated
          case 'contestCreated':
            // Posting a contest via the webapp PJP involves creating a draft
            // contest and activating it via cart backend.
            // The datastore won't know that the contest status has changed
            // in the backend so we will use this WS event to keep the document
            // in sync with the backend.
            return updateWebsocketDocuments<ContestsCollection>(
              state,
              [action.payload.data.contest_id],
              contest => ({
                ...contest,
                draft: false,
              }),
              ref,
            );

          case 'contestUpgraded':
            if (
              action.payload.data.new_upgrade === ContestUpgradeApi.NONPUBLIC
            ) {
              const newSeoUrl = action.payload.data.seo_url;
              return updateWebsocketDocuments<ContestsCollection>(
                state,
                [action.payload.data.contest_id],
                contest => ({
                  ...contest,
                  seoUrl: newSeoUrl,
                }),
                ref,
              );
            }
            break;

          default:
            return state;
        }
      }

      return state;
    }

    default:
      return state;
  }
}
