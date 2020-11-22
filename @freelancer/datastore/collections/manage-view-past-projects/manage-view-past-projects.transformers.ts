import { ProjectTypeApi } from 'api-typings/projects/projects';
import { ManageViewPastProjectsItemAjax } from './manage-view-past-projects.backend-model';
import { ManageViewPastProject } from './manage-view-past-projects.model';

export function transformManageViewPastProjectsItem(
  manageViewProjects: ManageViewPastProjectsItemAjax,
): ManageViewPastProject {
  return {
    id: `${manageViewProjects.id}-${manageViewProjects.bid?.bidId}`,
    projectId: manageViewProjects.id,
    title: manageViewProjects.title,
    seoUrl: manageViewProjects.seoUrl,
    projectType: manageViewProjects.hourly
      ? ProjectTypeApi.HOURLY
      : ProjectTypeApi.FIXED,
    recruiter: manageViewProjects.recruiter,
    currencyCode: manageViewProjects.currencyCode,
    bid: manageViewProjects.bid,
    rating: manageViewProjects.rating,
    projectStatus: manageViewProjects.projectStatus,
    timeSubmitted: manageViewProjects.timeSubmitted * 1000,
    milestoneAmount: manageViewProjects.milestoneAmount,
    milestoneCount: manageViewProjects.milestoneCount,
  };
}
