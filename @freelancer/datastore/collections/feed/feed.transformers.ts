import { assertNever } from '@freelancer/utils';
import { FeedItemApi, FeedReferenceTypeApi } from 'api-typings/feed/feed';
import { FeedItem } from './feed.model';

/**
 * Extra param `stacked` is used to determine whether we want to
 * stack this feed items on the top as new one (ex. 3 new items)
 * or just show in the feed.
 */
export function transformFeedItem(feedItem: FeedItemApi): FeedItem {
  switch (feedItem.reference_type) {
    case FeedReferenceTypeApi.POST:
      if (feedItem.reference_id === undefined) {
        throw new Error(
          `Missing reference_id on required type ${feedItem.reference_type} in response.`,
        );
      }
      return {
        id: feedItem.id,
        contextType: feedItem.context_type,
        contextId: feedItem.context_id,
        referenceType: feedItem.reference_type,
        referenceId: feedItem.reference_id,
        feedMetaId: feedItem.feed_meta_id,
        created: feedItem.created,
        updated: feedItem.updated,
      };

    default:
      assertNever(feedItem.reference_type);
  }
}
