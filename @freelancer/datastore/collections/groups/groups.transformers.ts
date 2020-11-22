import { GroupApi } from 'api-typings/groups/groups';
import { Group } from './groups.model';

export function transformGroup(group: GroupApi): Group {
  return {
    id: group.id,
    name: group.name,
    creatorId: group.creator_id,
    creatorType: group.creator_type,
    seoUrl: group.seo_url,
    groupType: group.group_type,
    description: group.description,
    created: group.created,
    isDeleted: group.is_deleted,
    updated: group.updated,
    isFeedRead: group.is_feed_read,
    coverImageUrl: group.cover_image_url,
  };
}
