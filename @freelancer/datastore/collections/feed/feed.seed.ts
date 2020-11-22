import { generateId } from '@freelancer/datastore/testing';
import {
  FeedContextTypeApi,
  FeedReferenceTypeApi,
} from 'api-typings/feed/feed';
import { FeedItem } from './feed.model';

export interface GenerateFeedOptions {
  readonly contextType: FeedContextTypeApi;
  readonly contextId: number;
  readonly feedMetaId: number;
  readonly created?: number;
  readonly updated?: number;
  readonly referenceType: FeedReferenceTypeApi;
  readonly referenceId: number;
}

export function generateFeedObject({
  contextType,
  contextId,
  feedMetaId,
  created,
  updated,
  referenceType,
  referenceId,
}: GenerateFeedOptions): FeedItem {
  const now = Date.now();

  return {
    id: generateId(),
    contextType,
    contextId,
    feedMetaId,
    created: created || now,
    updated: updated || now,
    referenceType,
    referenceId,
  };
}
