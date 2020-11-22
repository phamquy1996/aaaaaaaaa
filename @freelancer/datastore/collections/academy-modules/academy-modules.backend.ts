import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { AcademyModulesCollection } from './academy-modules.types';

export function modulesBackend(): Backend<AcademyModulesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getModules.php',
      isGaf: true,
      params: {
        ids: ids || [],
        courseId: getQueryParamValue(query, 'courseId')[0],
        courseDetails: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
