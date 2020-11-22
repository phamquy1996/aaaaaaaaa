import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { SkillsSubNavigationCollection } from './skills-sub-navigation.types';

export function skillsSubNavigationBackend(): Backend<
  SkillsSubNavigationCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `user-profile/skillsSubNavItems.php`,
      isGaf: true,
      params: {
        userIds: ids,
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
