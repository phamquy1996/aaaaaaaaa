import { generateId } from '@freelancer/datastore/testing';
import { FeedContextTypeApi } from 'api-typings/feed/feed';
import { FeedMeta } from './feed-meta.model';

export interface GenerateFeedMetaOptions {
  readonly contextType: FeedContextTypeApi;
  readonly contextId: number;
  readonly created?: number;
  readonly isRead?: boolean;
  readonly timeRead?: number;
}

export function generateFeedMetaObjects({
  contextType,
  contextId,
  created,
  isRead = true,
  timeRead,
}: GenerateFeedMetaOptions): FeedMeta {
  const now = Date.now();

  return {
    id: generateId(),
    contextType,
    contextId,
    created: created || now,
    isRead,
    timeRead: timeRead || now,
  };
}
