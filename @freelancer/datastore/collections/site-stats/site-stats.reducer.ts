import {
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformSiteStats } from './site-stats.transformer';
import { SiteStatsCollection } from './site-stats.types';

export function siteStatsReducer(
  state = {},
  action: CollectionActions<SiteStatsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'siteStats') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<SiteStatsCollection>(
          state,
          transformIntoDocuments(
            [result],
            transformSiteStats,
            ref.path.authUid,
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
