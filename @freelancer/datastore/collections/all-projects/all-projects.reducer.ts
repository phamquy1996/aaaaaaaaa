import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { AllProjectsContext } from './all-projects.model';
import { transformAllProjects } from './all-projects.transformer';
import { AllProjectsCollection } from './all-projects.types';

export function allProjectsReducer(
  state: CollectionStateSlice<AllProjectsCollection> = {},
  action: CollectionActions<AllProjectsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'allProjects') {
        const { result, ref, order } = action.payload;
        if (result.projects) {
          const context: AllProjectsContext = {
            unlistedProjects: getQueryParamValue(
              ref.query,
              'unlistedProjects',
            )[0],
            searchProjectStatus: getQueryParamValue(
              ref.query,
              'searchProjectStatus',
            )[0],
            bidAwardStatus: getQueryParamValue(ref.query, 'bidAwardStatus')[0],
            bidCompleteStatus: getQueryParamValue(
              ref.query,
              'bidCompleteStatus',
            )[0],
          };
          return mergeDocuments<AllProjectsCollection>(
            state,
            transformIntoDocuments(
              result.projects,
              transformAllProjects,
              context,
            ),
            order,
            ref,
          );
        }
      }
      return state;
    }

    default:
      return state;
  }
}
