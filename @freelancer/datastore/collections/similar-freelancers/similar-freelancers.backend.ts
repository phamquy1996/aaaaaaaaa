import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SimilarFreelancersCollection } from './similar-freelancers.types';

export function similarFreelancersBackend(): Backend<
  SimilarFreelancersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'user-profile/similarFreelancers.php',
      isGaf: true,
      params: {
        userIds: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
