import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { IssuingInstitutionCollection } from './issuing-institution.types';

export function issuingInstitutionBackend(): Backend<
  IssuingInstitutionCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `payments/0.1/iin/`,
      params: { bins: getQueryParamValue(query, 'bin') },
    }),
    // TODO: add actual filtering
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
