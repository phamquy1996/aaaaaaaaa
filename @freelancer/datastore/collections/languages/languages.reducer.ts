import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformLanguage } from './languages.transformers';
import { LanguagesCollection } from './languages.types';

export function languagesReducer(
  state: CollectionStateSlice<LanguagesCollection> = {},
  action: CollectionActions<LanguagesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'languages') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<LanguagesCollection>(
          state,
          transformIntoDocuments(result.languages, transformLanguage),
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
