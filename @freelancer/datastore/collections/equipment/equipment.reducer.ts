import {
  CollectionActions,
  CollectionStateSlice,
  mergeWebsocketDocuments,
} from '@freelancer/datastore/core';
import { EquipmentCollection } from './equipment.types';

export function equipmentReducer(
  state: CollectionStateSlice<EquipmentCollection> = {},
  action: CollectionActions<EquipmentCollection>,
) {
  switch (action.type) {
    case 'API_PUSH_SUCCESS': {
      if (action.payload.type === 'equipment') {
        const { ref, result } = action.payload;
        return mergeWebsocketDocuments<EquipmentCollection>(
          state,
          [result],
          ref,
        );
      }
      break;
    }

    default:
      return state;
  }
}
