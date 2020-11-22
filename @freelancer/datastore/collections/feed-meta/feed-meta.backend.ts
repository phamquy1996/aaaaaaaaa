import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import {
  FeedMetaUpdateActionType,
  FeedMetaUpdatePayload,
} from './feed-meta.backend-model';
import { FeedMetaCollection } from './feed-meta.types';

export function feedMetaBackend(): Backend<FeedMetaCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const contextType = getQueryParamValue(query, 'contextType')[0];
      const contextId = getQueryParamValue(query, 'contextId')[0];

      return {
        endpoint: `feed/0.1/feed_meta`,
        isGaf: false,
        params: {
          context_type: contextType,
          context_id: contextId,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: (authUid, feedMeta, originalFeedMeta) => {
      let payload: FeedMetaUpdatePayload | undefined;

      if (feedMeta.timeRead !== undefined) {
        payload = {
          action: FeedMetaUpdateActionType.READ,
        };
      }

      if (!payload) {
        throw new Error('Update payload is empty.');
      }

      return {
        endpoint: `feed/0.1/feed_meta/${originalFeedMeta.id}`,
        asFormData: false,
        payload,
        method: 'PUT',
      };
    },
    remove: undefined,
  };
}
