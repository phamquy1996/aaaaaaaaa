import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SuggestedSkillsCollection } from './suggested-skills.types';

export function suggestedSkillsBackend(): Backend<SuggestedSkillsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'skills/suggest.php',
      isGaf: true,
      params: {
        skills: getQueryParamValue(query, 'skills')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
