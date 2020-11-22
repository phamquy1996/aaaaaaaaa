import {
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformDashboardWidgets } from './dashboard-widgets.transformers';
import { DashboardWidgetsCollection } from './dashboard-widgets.types';

export function dashboardWidgetsReducer(
  state: CollectionStateSlice<DashboardWidgetsCollection> = {},
  action: CollectionActions<DashboardWidgetsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'dashboardWidgets') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<DashboardWidgetsCollection>(
          state,
          transformIntoDocuments(
            result.dashboardWidgets,
            transformDashboardWidgets,
          ),
          order,
          ref,
        );
      }
      return state;
    }
    default:
      return state;
  }
}
