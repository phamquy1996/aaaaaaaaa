import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { SuperuserProjectViewProjectsCollection } from './superuser-project-view-projects.types';

export function superuserProjectViewProjectsBackend(): Backend<
  SuperuserProjectViewProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order, resourceGroup) => {
      // Resource Group is used for document and to make ACL Permissions work
      // we need to pass in `poolIds` so it checks the right permissions.
      // We can also use `poolIds` for querying in a collection which means it doesn't
      // require `resourceGroup`.
      const poolIds = resourceGroup
        ? resourceGroup.poolIds
        : getQueryParamValue(query, 'poolIds')[0];

      return {
        endpoint: `superuser/0.1/projects`,
        params: {
          attachment_details: 'true',
          full_description: 'true',
          job_details: 'true',
          location_details: 'true',
          nda_details: 'true',
          projects: ids,
          project_collaboration_details: 'true',
          pool_ids: poolIds,
          seo_urls: getQueryParamValue(query, 'seoUrl'),
          selected_bids: 'true',
          qualification_details: 'true',
          upgrade_details: 'true',
          review_availability_details: 'true',
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
