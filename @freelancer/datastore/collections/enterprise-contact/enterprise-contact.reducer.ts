import {
  CollectionActions,
  CollectionStateSlice,
} from '@freelancer/datastore/core';
import { EnterpriseContactCollection } from './enterprise-contact.types';

export function enterpriseContactReducer(
  state: CollectionStateSlice<EnterpriseContactCollection> = {},
  action: CollectionActions<EnterpriseContactCollection>,
) {
  return state;
}
