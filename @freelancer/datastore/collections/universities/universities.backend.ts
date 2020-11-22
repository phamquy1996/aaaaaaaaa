import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { UniversitiesCollection } from './universities.types';

export function universitiesBackend(): Backend<UniversitiesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'users/0.1/universities',
      isGaf: false,
      params: {
        university_ids: ids,
        country_codes: getQueryParamValue(query, 'countryCode'),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
