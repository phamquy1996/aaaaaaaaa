import { defaultPredictedSkills } from '../skills/skills.seed';
import { PredictedSkills } from './predicted-skills.model';

export interface GeneratePredictedSkillsOptions {
  readonly title: string;
  readonly description: string;
  readonly skillIds?: ReadonlyArray<number>;
}

export function generatePredictedSkillsObject({
  title,
  description,
  skillIds = defaultPredictedSkills.map(skill => skill.id),
}: GeneratePredictedSkillsOptions): PredictedSkills {
  return {
    id: `${title}-${description}`,
    title,
    description,
    skills: skillIds,
  };
}
