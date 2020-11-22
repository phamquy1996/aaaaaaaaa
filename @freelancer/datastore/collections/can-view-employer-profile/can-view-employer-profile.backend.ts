import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { CanViewEmployerProfileCollection } from './can-view-employer-profile.types';

export function canViewEmployerProfileBackend(): Backend<
  CanViewEmployerProfileCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      if (ids === undefined || !ids[0]) {
        throw new Error('Set `id` on canViewEmployerProfile query');
      }

      if (ids.length > 1) {
        throw new Error(
          'Collection canViewEmployerProfile accepts only single id',
        );
      }

      return {
        endpoint: 'user-profile/canViewEmployerProfile.php',
        isGaf: true,
        params: { userId: ids[0] },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
