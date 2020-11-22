import { GlobalTagApi } from 'api-typings/common/common';
import { Tag } from './tags.model';

export function transformTag(tag: GlobalTagApi): Tag {
  if (!tag.id) {
    throw new ReferenceError(`Tag does not have id.`);
  }

  if (!tag.name) {
    throw new ReferenceError(`Tag does not have a name.`);
  }

  return {
    id: tag.id,
    name: tag.name,
    seoName: tag.seo_name,
    isCategory: tag.is_category || false,
    parentId: tag.parent_id,
    properties: tag.properties,
    families: tag.families,
    displayName: tag.display_name || titleCase(tag.name),
  };
}

export function titleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
