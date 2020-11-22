import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { DashboardWidgetsCollection } from './dashboard-widgets.types';

export function dashboardWidgetsBackend(): Backend<DashboardWidgetsCollection> {
  return {
    defaultOrder: {
      field: 'order',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'dashboard/get-dashboard-widgets.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
