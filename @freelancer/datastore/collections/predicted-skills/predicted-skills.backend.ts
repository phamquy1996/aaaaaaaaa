import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { PredictedSkillsCollection } from './predicted-skills.types';

export function predictedSkillsBackend(): Backend<PredictedSkillsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'skills/predict.php',
      isGaf: true,
      params: {
        title: getQueryParamValue(query, 'title')[0],
        description: getQueryParamValue(query, 'description')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
