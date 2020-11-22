import { Skill } from '../skills/skills.model';
import { phpSkill, snakeCase } from '../skills/skills.seed';
import { SimilarFreelancers } from './similar-freelancers.model';

export interface GenerateSimilarFreelancersOptions {
  readonly userId: number;
  readonly skills?: ReadonlyArray<Skill>;
}

export function generateSimilarFreelancersObject({
  userId,
  skills = [phpSkill()],
}: GenerateSimilarFreelancersOptions): SimilarFreelancers {
  return {
    id: userId,
    tags: skills.map(skill => ({
      url: `/freelancers/skills/${snakeCase(skill.seoUrl)}`,
      label: skillNameToLabel(skill),
    })),
  };
}

function skillNameToLabel(skill: Skill) {
  switch (skill.name) {
    case 'PHP': {
      return 'PHP Developer';
    }
    case 'Python': {
      return 'Python Developer';
    }
    case 'Website Design': {
      return 'Website Designer';
    }
    case 'Graphic Design': {
      return 'Graphic Designer';
    }
    case 'Translation': {
      return 'Translator';
    }
    case 'Photography': {
      return 'Photographer';
    }
    case 'Logo Design': {
      return 'Logo Designer';
    }
    default:
      throw new Error(`Cannot convert skill ${skill.name} to label`);
  }
}
