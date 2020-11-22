import { AttachmentApi, TextEntityApi } from 'api-typings/common/common';
import { PostApi } from 'api-typings/posts/posts';
import { Attachment, Post, TextEntity } from './feed-posts.model';

export function transformFeedPost(post: PostApi): Post {
  return {
    attachments: post.attachments.map(transformPostAttachment),
    commentingDisabled: post.commenting_disabled,
    content: post.content || '',
    created: post.created * 1000,
    entities: post.entities.map(transformPostEntity),
    isDeleted: post.is_deleted,
    ownerId: post.owner_id,
    ownerType: post.owner_type,
    updated: post.updated * 1000,
    deleted: post.deleted ? post.deleted * 1000 : undefined,
    id: post.id,
  };
}

function transformPostAttachment(attachment: AttachmentApi): Attachment {
  return {
    id: attachment.id,
    attachedToType: attachment.attached_to_type,
    attachedToId: attachment.attached_to_id,
    attachedObjectType: attachment.attached_object_type,
    attachedObjectId: attachment.attached_object_id,
    attachedByType: attachment.attached_by_type,
    attachedById: attachment.attached_by_id,
    created: attachment.created * 1000,
  };
}

function transformPostEntity(entity: TextEntityApi): TextEntity {
  return {
    id: entity.id,
    offset: entity.offset,
    length: entity.length,
    referenceType: entity.reference_type,
    referenceId: entity.reference_id,
    contextType: entity.context_type,
    contextId: entity.context_id,
  };
}
