import { UniversityApi } from 'api-typings/users/users';
import { University } from './universities.model';

export function transformUniversities(university: UniversityApi): University {
  return {
    id: university.id,
    countryCode: university.country_code,
    name: university.name,
    stateCode: university.state_code,
  };
}
