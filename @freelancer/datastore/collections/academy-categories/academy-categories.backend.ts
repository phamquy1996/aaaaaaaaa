import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { AcademyCategoriesCollection } from './academy-categories.types';

export function academyCategoriesBackend(): Backend<
  AcademyCategoriesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getCategories.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
