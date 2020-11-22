import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ExamsCollection } from './exams.types';

export function examsBackend(): Backend<ExamsCollection> {
  return {
    defaultOrder: {
      field: 'name',
      direction: OrderByDirection.ASC,
    },
    fetch: () => ({
      endpoint: 'education/exams.php',
      isGaf: true,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
