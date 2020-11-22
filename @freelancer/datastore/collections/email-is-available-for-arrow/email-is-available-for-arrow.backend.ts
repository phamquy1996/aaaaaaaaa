import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { EmailIsAvailableForArrowCollection } from './email-is-available-for-arrow.types';

export function emailIsAvailableForArrowBackend(): Backend<
  EmailIsAvailableForArrowCollection
> {
  return {
    defaultOrder: {
      field: 'email',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'auth/arrow/checkEmailExists.php',
      isGaf: true,
      params: {
        email: getQueryParamValue(query, 'email')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
