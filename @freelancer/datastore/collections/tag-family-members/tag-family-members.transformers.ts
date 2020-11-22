import { TagFamilyMemberResultAjax } from './tag-family-members.backend-model';
import { TagFamilyMember } from './tag-family-members.model';

export function transformTagFamilyMember(
  tagFamilyMember: TagFamilyMemberResultAjax,
): TagFamilyMember {
  return {
    id: `${tagFamilyMember.tag_id}-${tagFamilyMember.family_id}`,
    family_id: tagFamilyMember.family_id,
    tag_id: tagFamilyMember.tag_id,
    name: tagFamilyMember.name,
    seo_name: tagFamilyMember.seo_name,
    use_count: tagFamilyMember.use_count,
  };
}
