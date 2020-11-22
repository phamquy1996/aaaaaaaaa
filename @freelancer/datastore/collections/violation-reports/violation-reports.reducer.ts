import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformViolationReports } from './violation-reports.transformers';
import { ViolationReportsCollection } from './violation-reports.types';

export function violationReportsReducer(
  state: CollectionStateSlice<ViolationReportsCollection> = {},
  action: CollectionActions<ViolationReportsCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'violationReports') {
        const { result, ref } = action.payload;

        return mergeWebsocketDocuments<ViolationReportsCollection>(
          state,
          transformIntoDocuments([result], transformViolationReports),
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
