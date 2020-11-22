import { Skill } from '../skills/skills.model';
import { phpSkill, snakeCase } from '../skills/skills.seed';
import { TopSkill } from './top-skills.model';

export interface GenerateTopSkillsOptions {
  readonly userId: number;
  readonly skills?: ReadonlyArray<Skill>;
}

export function generateTopSkillObjects({
  userId,
  skills = [phpSkill()],
}: GenerateTopSkillsOptions): ReadonlyArray<TopSkill> {
  return skills.map(skill =>
    generateTopSkillObject({
      skillId: skill.id,
      userId,
      name: skill.name,
      seoUrl: skill.seoUrl,
    }),
  );
}

export interface GenerateTopSkillOptions {
  readonly skillId: number;
  readonly userId: number;
  readonly name: string;
  readonly seoUrl: string;
  readonly isLocal?: boolean;
  readonly usages?: number;
  readonly certified?: boolean;
}

export function generateTopSkillObject({
  skillId,
  userId,
  name,
  seoUrl,
  isLocal = false,
  usages = 0,
  certified = false,
}: GenerateTopSkillOptions): TopSkill {
  return {
    id: skillId,
    userId,
    name,
    seoUrl: snakeCase(seoUrl), // differs from `skills` collection which is kebab-case
    isLocal,
    usages,
    certified,
  };
}

// --- Mixins ---
export function fromSkill(
  skill: Skill,
): Pick<GenerateTopSkillOptions, 'skillId' | 'name'> {
  return {
    skillId: skill.id,
    name: skill.name,
  };
}
