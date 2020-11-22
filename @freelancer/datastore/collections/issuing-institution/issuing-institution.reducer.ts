import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformIssuingInstitution } from './issuing-institution.transformers';
import { IssuingInstitutionCollection } from './issuing-institution.types';

export function issuingInstitutionReducer(
  state: CollectionStateSlice<IssuingInstitutionCollection> = {},
  action: CollectionActions<IssuingInstitutionCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'issuingInstitution') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<IssuingInstitutionCollection>(
          state,
          transformIntoDocuments(result.iins, transformIssuingInstitution),
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
