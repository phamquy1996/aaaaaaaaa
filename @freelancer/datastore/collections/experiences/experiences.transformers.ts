import { ExperienceApi } from 'api-typings/users/users';
import { Experience } from './experiences.model';

export function transformExperience(experience: ExperienceApi): Experience {
  return {
    id: experience.id,
    userId: experience.user_id,
    ordering: experience.ordering || 0,
    title: experience.title,
    company: experience.company,
    description: experience.description,
    startDate: experience.start_date ? experience.start_date * 1000 : undefined,
    endDate: experience.end_date ? experience.end_date * 1000 : undefined,
    duration:
      experience.start_date && experience.end_date
        ? experience.end_date * 1000 - experience.start_date * 1000
        : undefined,
  };
}
