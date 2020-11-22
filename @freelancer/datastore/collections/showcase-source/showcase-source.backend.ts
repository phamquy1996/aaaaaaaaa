import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ShowcaseSourceCollection } from './showcase-source.types';

export function showcaseSourceBackend(): Backend<ShowcaseSourceCollection> {
  return {
    defaultOrder: {
      field: 'timestamp',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'showcase/getShowcaseSources.php',
      isGaf: true,
      params: {},
    }),
    push: (_, data) => ({
      endpoint: 'showcase/savePublishableWork.php',
      isGaf: true,
      payload: {
        freelancer_id: data.freelancerId,
        parent_source_id: data.parentSourceId,
        type: data.type,
        publishable: true,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
