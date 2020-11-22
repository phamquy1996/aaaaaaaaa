import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { ProjectUpgradeFeesCollection } from './project-upgrade-fees.types';

export function projectUpgradeFeesBackend(): Backend<
  ProjectUpgradeFeesCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => {
      // We may request fees with respect to a singular project or none.
      const projects = getQueryParamValue(query, 'projectId');
      if (projects.length > 1) {
        throw new Error('Attempted to query for multiple projects.');
      }

      return {
        endpoint: '/projects/0.1/projects/fees',
        params: {
          currencies: [
            ...(ids || []).map(toNumber),
            ...getQueryParamValue(query, 'currencyId'),
          ],
          tax_included: toNumber(authUid) === 0 ? undefined : 'true',
          project: projects ? projects[0] : undefined,
          free_upgrade_details: toNumber(authUid) === 0 ? undefined : 'true',
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
