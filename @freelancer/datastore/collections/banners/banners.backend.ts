import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
  RawQuery,
} from '@freelancer/datastore/core';
import { Banner, BannerType } from './banners.model';
import { BannersCollection } from './banners.types';

export function bannersBackend(): Backend<BannersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'banners/chooseBanner.php',
      isGaf: true,
      params: {
        type: getQueryParamBannersType(query),
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function getQueryParamBannersType(
  query: RawQuery<Banner> | undefined,
): BannerType | undefined {
  return getQueryParamValue(query, 'type', param =>
    param.condition === '==' ? param.value : undefined,
  )[0];
}
