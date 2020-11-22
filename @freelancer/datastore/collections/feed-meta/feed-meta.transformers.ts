import { FeedMetaApi } from 'api-typings/feed/feed';
import { FeedMeta } from './feed-meta.model';

export function transformFeedMeta(feedMeta: FeedMetaApi): FeedMeta {
  return {
    id: feedMeta.id,
    contextType: feedMeta.context_type,
    contextId: feedMeta.context_id,
    created: feedMeta.created,
    isRead: feedMeta.is_read,
    // We are already returning milliseconds.
    // tslint:disable-next-line: validate-millisecond-timestamps
    timeRead: feedMeta.time_read !== undefined ? feedMeta.time_read : undefined,
  };
}
