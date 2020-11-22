import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { OnBehalfProjectsCollection } from './on-behalf-projects.types';

export function onBehalfProjectsBackend(): Backend<OnBehalfProjectsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'on-behalf-project/on-behalf-project.php',
      isGaf: true,
      params: {
        id: ids ? ids[0] : undefined,
        project_id: getQueryParamValue(query, 'projectId'),
      },
    }),
    push: (authUid, onBehalfProject) => ({
      asFormData: true,
      endpoint: 'on-behalf-project/on-behalf-project.php',
      isGaf: true,
      payload: {
        email: onBehalfProject.nominatedUserEmail,
        projectData: JSON.stringify({
          ...onBehalfProject,
          timeframe: onBehalfProject.timeframe
            ? {
                startDate: onBehalfProject.timeframe.startDate / 1000,
                endDate: onBehalfProject.timeframe.endDate / 1000,
              }
            : undefined,
          userId: toNumber(authUid),
        }),
      },
    }),
    set: undefined,
    update: (authUid, onBehalfProject) => {
      const method: 'PUT' | 'POST' = 'PUT';

      if (!onBehalfProject.id) {
        throw new Error(
          'You must specify an ID to update an On Behalf project.',
        );
      }
      if (!onBehalfProject.status) {
        throw new Error(
          'You must specify a status to update the On Behalf project.',
        );
      }
      return {
        asFormData: true,
        endpoint: 'on-behalf-project/on-behalf-project.php',
        isGaf: true,
        payload: {
          id: onBehalfProject.id,
          status: onBehalfProject.status,
        },
        method,
      };
    },
    remove: undefined,
  };
}
