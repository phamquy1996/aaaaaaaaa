import { defaultPredictedSkills } from '../skills/skills.seed';
import { SuggestedSkills } from './suggested-skills.model';

export interface GenerateSuggestedSkillsOptions {
  readonly skillIds: ReadonlyArray<number>;
  readonly suggestedSkillIds?: ReadonlyArray<number>;
}

export function generateSuggestedSkillsObject({
  skillIds,
  suggestedSkillIds = defaultPredictedSkills.map(skill => skill.id),
}: GenerateSuggestedSkillsOptions): SuggestedSkills {
  return {
    id: skillIds.join('-'),
    skills: skillIds,
    suggestedSkills: suggestedSkillIds,
  };
}
