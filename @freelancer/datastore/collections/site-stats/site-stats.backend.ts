import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SiteStatsCollection } from './site-stats.types';

export function siteStatsBackend(): Backend<SiteStatsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This is only ever for the current user so ordering doesn't matter.
    fetch: (authUid, ids, query, order) => ({
      endpoint: `site-stats.php`,
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
