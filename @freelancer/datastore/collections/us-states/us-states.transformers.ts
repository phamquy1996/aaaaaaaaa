import { toNumber } from '@freelancer/utils';
import { UsStatesAjax } from './us-states.backend-model';
import { UsState } from './us-states.model';

export function transformUsStates(usStates: UsStatesAjax): UsState {
  return {
    countryCode: usStates.country_code,
    id: toNumber(usStates.id),
    name: usStates.name,
    stateCode: usStates.code,
  };
}
