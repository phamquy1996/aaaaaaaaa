import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformBillingAgreements } from './billing-agreements.transformers';
import { BillingAgreementsCollection } from './billing-agreements.types';

export function billingAgreementsReducer(
  state: CollectionStateSlice<BillingAgreementsCollection> = {},
  action: CollectionActions<BillingAgreementsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'billingAgreements') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<BillingAgreementsCollection>(
          state,
          transformIntoDocuments(
            result.payment_source,
            transformBillingAgreements,
          ),
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
