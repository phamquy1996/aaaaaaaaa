import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { EntityTypeApi } from 'api-typings/common/common';
import { GrantsCollection } from './grants.types';

export function grantsBackend(): Backend<GrantsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `users/0.1/grants`,
      params: {
        grants: ids,
        roles: getQueryParamValue(query, 'roleId'),
        users: getQueryParamValue(query, 'resource')
          .filter(resource => resource.entityType === EntityTypeApi.USER)
          .map(entity => entity.id),
        projects: getQueryParamValue(query, 'resource')
          .filter(resource => resource.entityType === EntityTypeApi.PROJECT)
          .map(entity => entity.id),
        enterprises: getQueryParamValue(query, 'resource')
          .filter(resource => resource.entityType === EntityTypeApi.ENTERPRISE)
          .map(entity => entity.id),
        pools: getQueryParamValue(query, 'resource')
          .filter(resource => resource.entityType === EntityTypeApi.POOL)
          .map(entity => entity.id),
        permission: getQueryParamValue(query, 'grantedPermissions')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
