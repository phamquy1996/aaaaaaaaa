import { ProjectTypeApi } from 'api-typings/projects/projects';
import { transformProjectBudget } from '../projects/projects.transformers';
import { ManageViewOpenProjectsItemAjax } from './manage-view-open-projects.backend-model';
import { ManageViewOpenProject } from './manage-view-open-projects.model';

export function transformManageViewOpenProjectsItem(
  manageViewProjects: ManageViewOpenProjectsItemAjax,
): ManageViewOpenProject {
  return {
    id: manageViewProjects.id,
    title: manageViewProjects.title,
    seoUrl: manageViewProjects.seoUrl,
    projectType: manageViewProjects.hourly
      ? ProjectTypeApi.HOURLY
      : ProjectTypeApi.FIXED,
    recruiter: manageViewProjects.recruiter,
    bidCount: manageViewProjects.bidCount,
    bidAvg: manageViewProjects.bidAvg ?? 0,
    budget: transformProjectBudget({
      minimum: manageViewProjects.minBudget,
      maximum: manageViewProjects.maxBudget,
      currency_id: manageViewProjects.currencyId,
    }),
    currencyCode: manageViewProjects.currencyCode,
    bidderId: manageViewProjects.bidderId,
    bidEndDate: manageViewProjects.bidEndDate * 1000,
    isHireMe: manageViewProjects.isHireMe,
    timeSubmitted: manageViewProjects.timeSubmitted * 1000,
    projectStatus: manageViewProjects.projectStatus,
  };
}
