import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ModifyBidSellerFeesCollection } from './modify-bid-seller-fees.types';

export function modifyBidSellerFeesBackend(): Backend<
  ModifyBidSellerFeesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      asFormData: true,
      params: {
        bidId: getQueryParamValue(query, 'bidId')[0],
        newAmount: getQueryParamValue(query, 'newAmount')[0],
        selectedTeamId: getQueryParamValue(query, 'selectedTeamId')[0],
      },
      endpoint: 'projects/modifyBidSellerFee.php',
      isGaf: true,
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
