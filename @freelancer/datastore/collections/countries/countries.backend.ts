import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { CountriesCollection } from './countries.types';

export function countriesBackend(): Backend<CountriesCollection> {
  return {
    defaultOrder: {
      field: 'name',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'common/0.1/countries/',
      params: { extra_details: true },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
