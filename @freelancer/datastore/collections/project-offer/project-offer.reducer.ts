import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  Reference,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import { transformProjectOffer } from './project-offer.transformers';
import { ProjectOfferCollection } from './project-offer.types';

export function projectOfferReducer(
  state: CollectionStateSlice<ProjectOfferCollection> = {},
  action: CollectionActions<ProjectOfferCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectOffer') {
        const { result, ref, order } = action.payload;
        if (result.projectOffers) {
          return mergeDocuments<ProjectOfferCollection>(
            state,
            transformIntoDocuments(result.projectOffers, transformProjectOffer),
            order,
            ref,
          );
        }
        return state;
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'projectOffer') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<ProjectOfferCollection>(
          state,
          transformIntoDocuments([result.projectOffer], transformProjectOffer),
          ref,
        );
      }
      return state;
    }
    case 'WS_MESSAGE': {
      const ref: Reference<ProjectOfferCollection> = {
        path: {
          collection: 'projectOffer',
          authUid: action.payload.toUserId,
        },
      };
      if (action.payload.parent_type === 'notifications') {
        switch (action.payload.type) {
          case 'denyed': {
            const id = action.payload.data.projectOfferId;

            if (!id) {
              return state;
            }

            return updateWebsocketDocuments<ProjectOfferCollection>(
              state,
              [id],
              projectOffer => ({
                ...projectOffer,
                awardStatus: BidAwardStatusApi.REJECTED,
              }),
              ref,
            );
          }
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
