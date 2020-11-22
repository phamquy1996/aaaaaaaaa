import {
  Backend,
  getNearbyQueryParamValue,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import { SearchActiveProjectsCollection } from './search-active-projects.types';

export function searchActiveProjectsBackend(): Backend<
  SearchActiveProjectsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // This endpoint is only used with search queries so doesn't need an ordering

    fetch: (authUid, ids, query, order) => {
      const searchCoordinates = getNearbyQueryParamValue(
        query,
        'searchCoordinates',
      );
      const projectTypes = getQueryParamValue(query, 'type')[0];

      let params = {
        // Projections
        full_description: 'true',
        job_details: 'true',
        location_details: 'true',
        upgrade_details: 'true',

        // Filters
        countries: getQueryParamValue(query, 'country').map(
          country => country?.code,
        ),
        jobs: getQueryParamValue(query, 'skillIds')[0],
        languages: getQueryParamValue(query, 'language'),
        latitude: searchCoordinates?.latitude,
        longitude: searchCoordinates?.longitude,
        offset: query?.searchQueryParams?.offset,
        project_types: projectTypes,
        project_upgrades: getQueryParamValue(query, 'upgrades').map(upgrades =>
          Object.entries(upgrades)
            .filter(([_, isApplied]) => !!isApplied)
            .map(([upgrade, _]) => upgrade),
        )[0],
        query: query?.searchQueryParams?.query || query?.searchQueryParams?.q,
      };

      // When there is no project type supplied to `query`, assume the default case where
      // we're querying for all supported project types
      const isProjectTypeDefault =
        !isDefined(projectTypes) || projectTypes.length === 0;
      const budget = getQueryParamValue(query, 'budget')[0] ?? {};

      if (
        isProjectTypeDefault ||
        projectTypes.includes(ProjectTypeApi.HOURLY)
      ) {
        params = {
          ...params,
          ...{
            max_avg_hourly_rate: budget.maximum,
            min_avg_hourly_rate: budget.minimum,
          },
        };
      }

      if (isProjectTypeDefault || projectTypes.includes(ProjectTypeApi.FIXED)) {
        params = {
          ...params,
          ...{
            max_avg_price: budget.maximum,
            min_avg_price: budget.minimum,
          },
        };
      }

      return {
        endpoint: `projects/0.1/projects/active`,
        params,
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
