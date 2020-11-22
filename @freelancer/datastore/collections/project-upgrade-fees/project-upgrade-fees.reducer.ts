import {
  CollectionActions,
  CollectionStateSlice,
  getQueryParamValue,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import { transformProjectUpgradeFees } from './project-upgrade-fees.transformers';
import { ProjectUpgradeFeesCollection } from './project-upgrade-fees.types';

export function projectUpgradeFeesReducer(
  state: CollectionStateSlice<ProjectUpgradeFeesCollection> = {},
  action: CollectionActions<ProjectUpgradeFeesCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'projectUpgradeFees') {
        const { result, ref, order } = action.payload;
        const projects = getQueryParamValue(ref.query, 'projectId');
        return mergeDocuments<ProjectUpgradeFeesCollection>(
          state,
          transformIntoDocuments(
            result.project_upgrade_fees,
            transformProjectUpgradeFees,
            projects.length === 1 ? projects[0] : undefined,
          ),
          order,
          ref,
        );
      }
      return state;
    }

    default:
      return state;
  }
}
