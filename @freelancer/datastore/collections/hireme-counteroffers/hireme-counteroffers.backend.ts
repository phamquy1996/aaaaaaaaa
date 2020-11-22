import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { HiremeCounteroffersCollection } from './hireme-counteroffers.types';

export function hiremeCounterofferBackend(): Backend<
  HiremeCounteroffersCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'hireme-counteroffer/getHireMeCounteroffer.php',
      isGaf: true,
      params: {
        bidId: getQueryParamValue(query, 'bidId')[0],
      },
    }),
    push: (_, counteroffer, extra) => {
      if (!counteroffer.bidId) {
        throw new Error('Could not push due to missing counteroffer bid id');
      }
      if (!counteroffer.newAmount) {
        throw new Error('Could not push due to missing counteroffer amount');
      }
      if (!counteroffer.newPeriod) {
        throw new Error('Could not push due to missing counteroffer period');
      }

      return {
        endpoint: `hireme-counteroffer/createHireMeCounteroffer.php`,
        asFormData: true,
        payload: {
          bidId: counteroffer.bidId,
          newAmount: counteroffer.newAmount,
          newPeriod: counteroffer.newPeriod,
          comment: counteroffer.comment,
        },
        isGaf: true,
      };
    },
    set: undefined,
    update: (authUid, counteroffer, originalCounteroffer) => {
      if (!counteroffer.bidId) {
        throw new Error('Could not update due to missing counteroffer bid id');
      }

      if (!counteroffer.status) {
        throw new Error('Could not update due to missing counteroffer status');
      }

      return {
        endpoint: 'hireme-counteroffer/updateHireMeCounteroffer.php',
        asFormData: true,
        payload: {
          bidId: counteroffer.bidId,
          status: counteroffer.status,
        },
        isGaf: true,
        method: 'POST',
      };
    },
    remove: undefined,
  };
}
