import { generateId } from '@freelancer/datastore/testing';
import { Experience } from './experiences.model';

export interface GenerateExperienceOptions {
  readonly userId: number;
  readonly title?: string;
  readonly company?: string;
  readonly description?: string;
  readonly startDate?: number;
  readonly endDate?: number;
}

let ordering = 0;

export function generateExperienceObject({
  userId,
  title = 'Product Manager',
  company = 'Newtech Ltd.',
  description = 'Responsible for growing several products.',
  startDate = new Date(2010, 0).getTime(),
  endDate, // defaults to undefined, which means the experience is current
}: GenerateExperienceOptions): Experience {
  ordering += 1;

  return {
    id: generateId(),
    userId,
    ordering,
    title,
    company,
    description,
    startDate,
    endDate,
    duration: startDate && endDate ? endDate - startDate : undefined,
  };
}
