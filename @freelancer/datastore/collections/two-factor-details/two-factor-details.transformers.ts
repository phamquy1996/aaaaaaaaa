// Import datastore helper functions if needed from '@freelancer/datastore/core'
// import { toNumber } from '@freelancer/utils';
import { TwoFactorDetailsGetResultAjax } from './two-factor-details.backend-model';
import { TwoFactorDetails } from './two-factor-details.model';

// Transforms what the backend returns into a format your components can consume
// Should only be called in this collection's reducer
export function transformTwoFactorDetails(
  twoFactorDetails: TwoFactorDetailsGetResultAjax,
  userId: number,
): TwoFactorDetails {
  return {
    id: userId,
    userId,
    ...twoFactorDetails,
  };
}
