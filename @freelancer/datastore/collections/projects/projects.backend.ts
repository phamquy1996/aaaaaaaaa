import {
  Backend,
  getQueryParamValue,
  objectKeysFilter,
  OrderByDirection,
  setDiff,
} from '@freelancer/datastore/core';
import { assertNever } from '@freelancer/utils';
import {
  ProjectStatusApi,
  ProjectUpgradeOptionsApi,
} from 'api-typings/projects/projects';
import { ProjectAction } from './projects.backend-model';
import { ProjectUpgrades } from './projects.model';
import { ProjectsCollection } from './projects.types';

export function projectsBackend(): Backend<ProjectsCollection> {
  return {
    defaultOrder: {
      field: 'timeSubmitted',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects`,
      params: {
        projects: ids,
        owners: getQueryParamValue(query, 'ownerId'),
        seo_urls: getQueryParamValue(query, 'seoUrl'),
        frontend_project_statuses: getQueryParamValue(
          query,
          'frontendProjectStatus',
        ),
        selected_bids: 'true', // For project status. TODO: remove once T69699 is fixed
        file_details: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, document, originalDocument) => {
      let payload:
        | ProjectsCollection['Backend']['Update']['PayloadType']
        | undefined;
      const method = 'PUT';
      const endpoint = `projects/0.1/projects/${originalDocument.id}/`;

      if (document.status === ProjectStatusApi.CLOSED) {
        payload = {
          action: ProjectAction.CLOSE,
        };
      }

      if (document.status === ProjectStatusApi.FROZEN) {
        payload = {
          action: ProjectAction.END_BIDDING,
        };
      }

      // Updating upgrades.
      if (document.upgrades) {
        if (payload) {
          throw new Error(`Cannot update two fields at once`);
        }

        const unconvertedUpgrades = setDiff(
          objectKeysFilter(document.upgrades, x => x),
          // refer to comments in project-view-project.backend.ts
          objectKeysFilter(
            originalDocument.upgrades,
            (val, key) => key !== 'extend' && val,
          ),
        );

        const upgrades = unconvertedUpgrades.map(convertUpgrade);

        payload = {
          action: ProjectAction.UPGRADE,
          'upgrades[]': upgrades,
        };
      }

      if (payload) {
        return {
          payload,
          endpoint,
          method,
        };
      }

      throw new Error(`Cound not update any fields of the project`);
    },
    remove: (authUid, projectId, originalDocument) => {
      const method = 'DELETE';
      const endpoint = `projects/0.1/projects/${projectId}`;
      const payload = {};
      return {
        payload,
        endpoint,
        method,
      };
    },
  };
}
export function convertUpgrade(
  upgrade: keyof ProjectUpgrades,
): ProjectUpgradeOptionsApi {
  switch (upgrade) {
    case 'featured':
      return ProjectUpgradeOptionsApi.FEATURED;
    case 'assisted':
      return ProjectUpgradeOptionsApi.RECRUITER;
    case 'extend':
      return ProjectUpgradeOptionsApi.EXTEND;
    case 'urgent':
      return ProjectUpgradeOptionsApi.URGENT;
    case 'nonpublic':
      return ProjectUpgradeOptionsApi.NONPUBLIC;
    case 'fulltime':
      return ProjectUpgradeOptionsApi.FULLTIME;
    case 'listed':
      throw new Error('You cannot upgrade to listed');
    case 'NDA':
      return ProjectUpgradeOptionsApi.NDA;
    case 'ipContract':
      return ProjectUpgradeOptionsApi.IP_CONTRACT;
    case 'sealed':
      return ProjectUpgradeOptionsApi.HIDEBIDS;
    // case 'successBundle':
    //   return ProjectUpgradeOptionsApi.SUCCESS_BUNDLE;
    // case 'nonCompete':
    //   return ProjectUpgradeOptionsApi.NON_COMPETE;
    case 'projectManagement':
      return ProjectUpgradeOptionsApi.PROJECT_MANAGEMENT;
    case 'pfOnly':
      return ProjectUpgradeOptionsApi.PF_ONLY;
    case 'qualified':
      throw new Error('You cannot upgrade to qualified');
    case 'unpaidRecruiter':
      throw new Error('You cannot upgrade to unpaid_recruiter');
    default:
      return assertNever(upgrade);
  }
}
