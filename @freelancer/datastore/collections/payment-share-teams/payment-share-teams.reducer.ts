import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformPaymentShareTeam } from './payment-share-teams.transformers';
import { PaymentShareTeamsCollection } from './payment-share-teams.types';

export function paymentShareTeamsReducer(
  state: CollectionStateSlice<PaymentShareTeamsCollection> = {},
  action: CollectionActions<PaymentShareTeamsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'paymentShareTeams') {
        const { result, ref, order } = action.payload;

        if (!result.teams) {
          throw new Error('Team is missing in the result');
        }

        return mergeDocuments<PaymentShareTeamsCollection>(
          state,
          transformIntoDocuments(result.teams, transformPaymentShareTeam),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'paymentShareTeams') {
        const { ref, result } = action.payload;

        if (!result.payment_share_team) {
          throw new Error('Payment share team is missing in the result');
        }

        return mergeWebsocketDocuments<PaymentShareTeamsCollection>(
          state,
          transformIntoDocuments(
            [result.payment_share_team],
            transformPaymentShareTeam,
          ),
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'paymentShareTeams') {
        const { originalDocument, result, ref } = action.payload;
        if (!result.team) {
          throw new Error('Team is missing in the result');
        }
        return mergeWebsocketDocuments<PaymentShareTeamsCollection>(
          state,
          transformIntoDocuments(
            [result.team],
            transformPaymentShareTeam,
            originalDocument,
          ),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
