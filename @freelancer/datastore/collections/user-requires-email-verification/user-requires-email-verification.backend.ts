import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserRequiresEmailVerificationCollection } from './user-requires-email-verification.types';

export function userRequiresEmailVerificationBackend(): Backend<
  UserRequiresEmailVerificationCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'trust-and-safety/userRequiresEmailVerification.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
