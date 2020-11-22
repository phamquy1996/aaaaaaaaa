import { generateId } from '@freelancer/datastore/testing';
import { Education } from './educations.model';

export interface GenerateEducationOptions {
  readonly userId: number;
  readonly schoolName?: string;
  readonly schoolId?: number;
  readonly otherSchoolName?: string;
  readonly country?: string;
  readonly countryCode?: string;
  readonly state?: string;
  readonly stateCode?: string;
  readonly degree?: string;
  readonly fieldOfStudy?: string;
  readonly startDate?: number;
  readonly endDate?: number;
}

let ordering = 0;

export function generateEducationObject({
  userId,
  schoolName = 'University of Technology, Sydney',
  schoolId = 391,
  otherSchoolName,
  country = 'Australia',
  countryCode = 'AU',
  state,
  stateCode,
  degree = 'Bachelor of Science',
  fieldOfStudy,
  startDate = new Date(2010, 0).getTime(),
  endDate = new Date(2014, 0).getTime(),
}: GenerateEducationOptions): Education {
  ordering += 1;

  return {
    id: generateId(),
    userId,
    ordering,
    schoolName,
    schoolId,
    otherSchoolName,
    country,
    countryCode,
    state,
    stateCode,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
    duration: startDate && endDate ? startDate - endDate : undefined,
  };
}
