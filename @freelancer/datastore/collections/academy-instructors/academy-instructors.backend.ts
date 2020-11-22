import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { AcademyInstructorsCollection } from './academy-instructors.types';

export function instructorsBackend(): Backend<AcademyInstructorsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'academy/getInstructors.php',
      isGaf: true,
      params: {
        id: ids ? ids[0] : undefined,
        user_id: getQueryParamValue(query, 'userId')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
