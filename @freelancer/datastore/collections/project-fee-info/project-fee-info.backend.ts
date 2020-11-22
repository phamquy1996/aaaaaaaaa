import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ProjectFeeInfoCollection } from './project-fee-info.types';

export function projectFeeInfoBackend(): Backend<ProjectFeeInfoCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint can only be queried by id and doesn't support ordering
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/getFeeExtraInfo.php`,
      isGaf: true,
      params: {
        projectIds: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
