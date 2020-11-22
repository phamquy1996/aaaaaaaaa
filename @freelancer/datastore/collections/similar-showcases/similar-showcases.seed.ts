import { Skill } from '../skills/skills.model';
import { phpSkill } from '../skills/skills.seed';
import { SimilarShowcases } from './similar-showcases.model';

export interface GenerateSimilarShowcasesOptions {
  readonly userId: number;
  readonly skills?: ReadonlyArray<Skill>;
}

export function generateSimilarShowcasesObject({
  userId,
  skills = [phpSkill()],
}: GenerateSimilarShowcasesOptions): SimilarShowcases {
  return {
    id: userId,
    tags: skills.map(skill => ({
      url: `/showcase/s/${skill.name}`,
      label: skill.name,
    })),
  };
}
