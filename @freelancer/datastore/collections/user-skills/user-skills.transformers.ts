import { UserApi } from 'api-typings/users/users';
import { UserSkill } from './user-skills.model';

export function transformUserSkills(userApi: UserApi): UserSkill {
  return {
    id: userApi.id,
    skills: (userApi.jobs || []).map(skill => skill.id),
  };
}
