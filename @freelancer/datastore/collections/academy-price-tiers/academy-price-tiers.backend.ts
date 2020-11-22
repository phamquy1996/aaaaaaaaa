import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { AcademyPriceTiersCollection } from './academy-price-tiers.types';

export function academyPriceTiersBackend(): Backend<
  AcademyPriceTiersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getPriceTiers.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
