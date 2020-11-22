import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { LanguagesCollection } from './languages.types';

export function languagesBackend(): Backend<LanguagesCollection> {
  return {
    defaultOrder: {
      field: 'code',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'language/getLanguages.php',
      isGaf: true,
      params: {
        active_only: getQueryParamValue(query, 'active')[0]
          ? 'true'
          : undefined,
        language_codes: ids || getQueryParamValue(query, 'code'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
