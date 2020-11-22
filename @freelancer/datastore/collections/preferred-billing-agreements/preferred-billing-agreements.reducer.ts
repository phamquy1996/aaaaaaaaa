import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import { transformPreferredBillingAgreement } from './preferred-billing-agreements.transformers';
import { PreferredBillingAgreementsCollection } from './preferred-billing-agreements.types';

export function preferredBillingAgreementsReducer(
  state: CollectionStateSlice<PreferredBillingAgreementsCollection> = {},
  action: CollectionActions<PreferredBillingAgreementsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'preferredBillingAgreements') {
        const { result, order, ref } = action.payload;
        return mergeDocuments<PreferredBillingAgreementsCollection>(
          state,
          transformIntoDocuments(
            result.preferred_payment_sources,
            transformPreferredBillingAgreement,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'preferredBillingAgreements') {
        const { delta, originalDocument, ref } = action.payload;
        return updateWebsocketDocuments<PreferredBillingAgreementsCollection>(
          state,
          [originalDocument.id],
          preferredBillingAgreement =>
            deepSpread(preferredBillingAgreement, delta),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
