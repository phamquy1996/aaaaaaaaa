import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { HourlyContractActionApi } from 'api-typings/payments/payments';
import { HourlyContractUpdateActionRawPayload } from './hourly-contracts.backend-model';
import { HourlyContractsCollection } from './hourly-contracts.types';

export function hourlyContractsBackend(): Backend<HourlyContractsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/hourly_contracts`,
      params: {
        project_ids: getQueryParamValue(query, 'projectId'),
        bidder_ids: getQueryParamValue(query, 'bidderId'),
        active: getQueryParamValue(query, 'active')[0] ? 'true' : undefined,
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, hourlyContract, originalHourlyContract) => {
      const endpoint = `projects/0.1/hourly_contracts/${originalHourlyContract.bidId}`;
      let payload: HourlyContractUpdateActionRawPayload | undefined;
      const asFormData = true;
      const method = 'PUT';

      if ('timeTrackingStopped' in hourlyContract) {
        if (hourlyContract.timeTrackingStopped === undefined) {
          payload = { action: HourlyContractActionApi.STOP_TIME_TRACKING };
        } else {
          payload = { action: HourlyContractActionApi.ENABLE_TIME_TRACKING };
        }
      } else if (
        'currentWorkLimit' in hourlyContract &&
        originalHourlyContract.currentWorkLimit !==
          hourlyContract.currentWorkLimit
      ) {
        payload = {
          action: HourlyContractActionApi.UPDATE,
          work_limit: hourlyContract.currentWorkLimit,
        };
      }

      if (payload === undefined) {
        throw new Error('Could not update due to missing payload');
      }

      return {
        endpoint,
        payload,
        method,
        asFormData,
      };
    },
    remove: undefined,
  };
}
