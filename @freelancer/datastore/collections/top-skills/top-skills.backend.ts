import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { TopSkillsCollection } from './top-skills.types';

export function topSkillsBackend(): Backend<TopSkillsCollection> {
  return {
    defaultOrder: {
      field: 'usages',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'skills/top-skills.php',
      isGaf: true,
      params: {
        userId: getQueryParamValue(query, 'userId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
