import { PredictedSkillEntryAjax } from './predicted-skills.backend-model';
import { PredictedSkills } from './predicted-skills.model';

export function transformPredictedSkills(
  predictedSkills: PredictedSkillEntryAjax,
): PredictedSkills {
  return {
    id: predictedSkills.id,
    title: predictedSkills.title,
    description: predictedSkills.description,
    skills: predictedSkills.skills,
  };
}
