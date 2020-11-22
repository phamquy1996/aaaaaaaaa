import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { LanguageDetectCollection } from './language-detect.types';

export function languageDetectBackend(): Backend<LanguageDetectCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'language/detectLanguage.php',
      isGaf: true,
      params: {
        text: getQueryParamValue(query, 'text')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
