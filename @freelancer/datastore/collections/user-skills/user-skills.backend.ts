import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { UserSkillsCollection } from './user-skills.types';

// The POST endpoint is not used as it doesn't override the usersSkills.

export function userSkillsBackend(): Backend<UserSkillsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: () => ({
      endpoint: 'users/0.1/self',
      isGaf: false,
      params: {
        jobs: 'true',
      },
    }),
    push: (_, userSkill) => ({
      endpoint: 'users/0.1/self/jobs',
      payload: {
        jobs: userSkill.skills || [],
      },
      isGaf: false,
      asFormData: true,
    }),
    set: undefined,
    update: (authUid, partial, original) => {
      const skillsToUpdate = partial.skills
        ? partial.skills.filter(isDefined)
        : [];

      if (skillsToUpdate.length === 0) {
        throw Error('You need at least 1 job to update.');
      }

      return {
        endpoint: 'users/0.1/self/jobs',
        method: 'PUT',
        asFormData: true,
        payload: {
          jobs: skillsToUpdate,
        },
      };
    },
    remove: (authUid, userId, original) => ({
      method: 'DELETE',
      endpoint: 'users/0.1/self/jobs',
      payload: {
        jobs: original.skills,
      },
    }),
  };
}
