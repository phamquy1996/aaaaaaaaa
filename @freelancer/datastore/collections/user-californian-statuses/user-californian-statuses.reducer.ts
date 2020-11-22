import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformUserCalifornianStatuses } from './user-californian-statuses.transformers';
import { UserCalifornianStatusesCollection } from './user-californian-statuses.types';

export function userCalifornianStatusesReducer(
  state: CollectionStateSlice<UserCalifornianStatusesCollection> = {},
  action: CollectionActions<UserCalifornianStatusesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'userCalifornianStatuses') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UserCalifornianStatusesCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformUserCalifornianStatuses,
            ref.path.authUid,
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
