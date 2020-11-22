import { toNumber } from '@freelancer/utils';
import { TopSkillsEntryAjax } from './top-skills.backend-model';
import { TopSkill } from './top-skills.model';

export function transformTopSkills(topSkills: TopSkillsEntryAjax): TopSkill {
  return {
    id: topSkills.id,
    userId: topSkills.user_id,
    name: topSkills.name,
    seoUrl: topSkills.seo_url,
    isLocal: topSkills.islocal ? toNumber(topSkills.islocal) === 1 : false,
    usages: topSkills.usages,
    certified: topSkills.certified ? topSkills.certified : false,
  };
}
