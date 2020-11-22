import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TwoFactorDetailsCollection } from './two-factor-details.types';

export function twoFactorDetailsBackend(): Backend<TwoFactorDetailsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => {
      const userId = getQueryParamValue(query, 'userId')[0];
      if (!userId) {
        throw new Error('userId must be provided to twoFactorDetails fetch');
      }

      return {
        endpoint: '/auth/getTotpMethods.php',
        isGaf: true,
        params: {
          user_id: userId,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
