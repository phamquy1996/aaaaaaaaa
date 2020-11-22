import { generateId } from '@freelancer/datastore/testing';
import {
  AttachedByTypeApi,
  AttachmentAttachedToTypeApi,
  TextEntityContextTypeApi,
} from 'api-typings/common/common';
import {
  FeedContextTypeApi,
  FeedReferenceTypeApi,
} from 'api-typings/feed/feed';
import {
  PostAttachmentApi,
  PostEntityApi,
  PostOwnerTypeApi,
} from 'api-typings/posts/posts';
import { FeedItem } from '../feed/feed.model';
import { Post } from './feed-posts.model';

export interface GenerateFeedPostsOptions {
  readonly userId: number;
  readonly content?: string;
  readonly commentingDisabled?: boolean;
  readonly attachments?: ReadonlyArray<PostAttachmentApi>;
  readonly entities?: ReadonlyArray<PostEntityApi>;
  readonly ownerType?: PostOwnerTypeApi;
  readonly ownerId?: number;
}

export function generateFeedPostObjects({
  userId,
  content,
  commentingDisabled = false,
  attachments = [],
  entities = [],
  ownerType,
  ownerId,
}: GenerateFeedPostsOptions): Post {
  const now = Date.now();
  const postId = generateId();

  return {
    id: postId,
    content: content || '',
    attachments: attachments.map(attachment => ({
      id: generateId(),
      attachedToType: AttachmentAttachedToTypeApi.POST,
      attachedToId: postId,
      attachedObjectType: attachment.attached_object_type,
      attachedObjectId: attachment.attached_object_id,
      attachedByType: AttachedByTypeApi.USER,
      attachedById: userId,
      created: now,
    })),
    entities: entities.map(entity => ({
      id: generateId(),
      offset: entity.offset,
      length: entity.length,
      referenceType: entity.reference_type,
      referenceId: entity.reference_id,
      contextType: TextEntityContextTypeApi.POST,
      contextId: postId,
    })),
    commentingDisabled,
    ownerType,
    ownerId,
    created: now,
    updated: now,
    deleted: undefined,
  };
}

export function feedPostToFeedItemTransformer(
  post: Post,
  extraParams: {
    readonly feedContextType: FeedContextTypeApi;
    readonly feedContextId: number;
    readonly feedMetaId: number;
  },
): FeedItem {
  return {
    id: generateId(),
    contextType: extraParams.feedContextType,
    contextId: extraParams.feedContextId,
    feedMetaId: extraParams.feedMetaId,
    created: post.created,
    updated: post.updated,
    referenceType: FeedReferenceTypeApi.POST,
    referenceId: post.id,
  };
}
