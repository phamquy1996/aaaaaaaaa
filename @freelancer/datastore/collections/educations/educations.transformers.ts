import { EducationApi } from 'api-typings/users/users';
import { Education } from './educations.model';

export function transformEducation(education: EducationApi): Education {
  return {
    id: education.id,
    userId: education.user_id,
    ordering: education.ordering || 0,
    schoolName: education.school_name,
    schoolId: education.school_id,
    otherSchoolName: education.other_school_name,
    countryCode: education.country_code,
    country: education.country,
    state: education.state,
    degree: education.degree,
    fieldOfStudy: education.field_of_study,
    startDate: education.start_date ? education.start_date * 1000 : undefined,
    endDate: education.end_date ? education.end_date * 1000 : undefined,
    duration:
      education.start_date && education.end_date
        ? education.end_date * 1000 - education.start_date * 1000
        : undefined,
  };
}
