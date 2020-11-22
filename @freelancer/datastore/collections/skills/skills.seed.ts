import { Skill } from './skills.model';

export function generateSkillObjects(): ReadonlyArray<Skill> {
  return skills;
}

const skills = [
  phpSkill(),
  pythonSkill(),
  websiteDesignSkill(),
  translationSkill(),
  photographySkill(),
  logoDesignSkill(),
  dataProcessingSkill(),
  dataEntrySkill(),
] as const;

/* For converting seoUrls to snake-case */
export function snakeCase(text: string) {
  return text.toLowerCase().replace(/[\s-]+/, '_');
}

export function phpSkill(): Skill {
  return {
    id: 3,
    name: 'PHP',
    category: {
      id: 1,
      name: 'Websites, IT & Software',
    },
    local: false,
    seoUrl: 'php',
    activeProjectCount: 467,
  };
}

export function pythonSkill(): Skill {
  return {
    id: 13,
    name: 'Python',
    category: { id: 1, name: 'Websites, IT & Software' },
    local: false,
    seoUrl: 'python',
    activeProjectCount: 6,
  };
}

export function websiteDesignSkill(): Skill {
  return {
    id: 17,
    name: 'Website Design',
    category: { id: 3, name: 'Design, Media & Architecture' },
    local: false,
    seoUrl: 'website-design',
    activeProjectCount: 619,
  };
}

export function graphicDesignSkill(): Skill {
  return {
    id: 20,
    name: 'Graphic Design',
    category: { id: 3, name: 'Design, Media & Architecture' },
    local: false,
    seoUrl: 'graphic-design',
    activeProjectCount: 290,
  };
}

export function translationSkill(): Skill {
  return {
    id: 22,
    name: 'Translation',
    category: { id: 2, name: 'Writing & Content' },
    local: false,
    seoUrl: 'translation',
    activeProjectCount: 13,
  };
}

export function photographySkill(): Skill {
  return {
    id: 27,
    name: 'Photography',
    category: { id: 3, name: 'Design, Media & Architecture' },
    local: true,
    seoUrl: 'photography',
    activeProjectCount: 63,
  };
}

export function logoDesignSkill(): Skill {
  return {
    id: 32,
    name: 'Logo Design',
    category: { id: 3, name: 'Design, Media & Architecture' },
    local: false,
    seoUrl: 'logo-design',
    activeProjectCount: 102,
  };
}

export function dataProcessingSkill(): Skill {
  return {
    id: 36,
    name: 'Data Processing',
    category: { id: 4, name: 'Data Entry & Admin' },
    local: false,
    seoUrl: 'data-processing',
    activeProjectCount: 6,
  };
}

export function dataEntrySkill(): Skill {
  return {
    id: 39,
    name: 'Data Entry',
    category: { id: 4, name: 'Data Entry & Admin' },
    local: false,
    seoUrl: 'data-entry',
    activeProjectCount: 45,
  };
}

export const defaultPredictedSkills = [
  phpSkill(),
  websiteDesignSkill(),
  translationSkill(),
  logoDesignSkill(),
  dataEntrySkill(),
] as const;
