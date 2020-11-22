import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { assertNever } from '@freelancer/utils';
import { FeedItemsOrderApi } from 'api-typings/feed/feed';
import { FeedItem } from './feed.model';
import { FeedCollection } from './feed.types';

export function feedBackend(): Backend<FeedCollection> {
  return {
    defaultOrder: {
      field: 'updated',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      const contextType = getQueryParamValue(query, 'contextType')[0];
      const contextId = getQueryParamValue(query, 'contextId')[0];
      if (!ids) {
        if (!contextType) {
          throw new Error("Required request field 'contextType' is missing.");
        }
        if (!contextId) {
          throw new Error("Required request field 'contextId' is missing.");
        }
      }

      return {
        endpoint: `feed/0.1/feed`,
        isGaf: false,
        params: {
          feed_item_ids: ids,
          context_type: contextType,
          context_id: contextId,
          order_by: FeedItemsOrderApi.UPDATED_DESC,
          last_value: getLastValue(query, FeedItemsOrderApi.UPDATED_DESC),
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: (authUid, id, document) => ({
      endpoint: `feed/0.1/feed/${id}/remove`,
      method: 'POST',
      payload: {},
    }),
  };
}

/**
 * Endpoint accepts last_vale parameter
 * to use it instead of using mysql offset.
 * What's the last_value depends on ordering type.
 * This function extracts last_value from query based
 * on ordering type.
 */
function getLastValue(
  query: RawQuery<FeedItem> | undefined,
  order: FeedItemsOrderApi,
): number | undefined {
  switch (order) {
    case FeedItemsOrderApi.ID_DESC: {
      const queryId = query?.queryParams?.id
        ? query.queryParams.id[0]
        : undefined;
      return queryId?.condition === '<' ? queryId.value : undefined;
    }
    case FeedItemsOrderApi.UPDATED_DESC: {
      const queryUpdated = query?.queryParams?.updated
        ? query.queryParams.updated[0]
        : undefined;
      return queryUpdated?.condition === '<' ? queryUpdated.value : undefined;
    }
    default:
      return assertNever(order);
  }
}
