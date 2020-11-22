import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformEmailIsAvailableForArrow } from './email-is-available-for-arrow.transformers';
import { EmailIsAvailableForArrowCollection } from './email-is-available-for-arrow.types';

export function emailIsAvailableForArrowReducer(
  state: CollectionStateSlice<EmailIsAvailableForArrowCollection> = {},
  action: CollectionActions<EmailIsAvailableForArrowCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'emailIsAvailableForArrow') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<EmailIsAvailableForArrowCollection>(
          state,
          transformIntoDocuments([result], transformEmailIsAvailableForArrow),
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
