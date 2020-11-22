import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformLanguageDetect } from './language-detect.transformers';
import { LanguageDetectCollection } from './language-detect.types';

export function languageDetectReducer(
  state: CollectionStateSlice<LanguageDetectCollection> = {},
  action: CollectionActions<LanguageDetectCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'languageDetect') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<LanguageDetectCollection>(
          state,
          transformIntoDocuments(result, transformLanguageDetect),
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
