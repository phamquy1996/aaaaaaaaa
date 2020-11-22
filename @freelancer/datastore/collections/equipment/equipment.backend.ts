import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { EquipmentCollection } from './equipment.types';

export function equipmentBackend(): Backend<EquipmentCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/equipment`,
      params: {
        equipment: ids,
      },
    }),
    push: (authUid, equipment) => ({
      endpoint: 'projects/0.1/equipment',
      isGaf: false,
      payload: { name: equipment.name },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
