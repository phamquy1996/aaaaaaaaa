import {
  CollectionActions,
  CollectionStateSlice,
} from '@freelancer/datastore/core';
import { GlobalFleetContactCollection } from './global-fleet-contact.types';

export function globalFleetContactReducer(
  state: CollectionStateSlice<GlobalFleetContactCollection> = {},
  action: CollectionActions<GlobalFleetContactCollection>,
) {
  return state;
}
