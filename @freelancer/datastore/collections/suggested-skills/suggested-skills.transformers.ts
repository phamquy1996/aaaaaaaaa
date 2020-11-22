import { SuggestedSkillsEntryAjax } from './suggested-skills.backend-model';
import { SuggestedSkills } from './suggested-skills.model';

export function transformSuggestedSkills(
  suggestedSkills: SuggestedSkillsEntryAjax,
): SuggestedSkills {
  return {
    id: suggestedSkills.id,
    skills: suggestedSkills.skills,
    suggestedSkills: suggestedSkills.suggestedSkills,
  };
}
