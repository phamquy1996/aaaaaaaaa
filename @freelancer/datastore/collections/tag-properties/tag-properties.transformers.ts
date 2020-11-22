import { TagPropertyResultAjax } from './tag-properties.backend-model';
import { TagProperty } from './tag-properties.model';

export function tansformTagProperty(
  tagFamily: TagPropertyResultAjax,
  id: string,
): TagProperty {
  return {
    id: `${tagFamily.parent_tag_id}-${tagFamily.family_id}`,
    familyId: tagFamily.family_id,
    parentTagId: tagFamily.parent_tag_id,
    name: tagFamily.name,
    question: tagFamily.question,
  };
}
