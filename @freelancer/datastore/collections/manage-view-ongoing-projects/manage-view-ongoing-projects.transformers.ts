import { ProjectTypeApi } from 'api-typings/projects/projects';
import { ManageViewOngoingProjectsItemAjax } from './manage-view-ongoing-projects.backend-model';
import { ManageViewOngoingProject } from './manage-view-ongoing-projects.model';

export function transformManageViewOngoingProjectsItem(
  manageViewProjects: ManageViewOngoingProjectsItemAjax,
): ManageViewOngoingProject {
  return {
    id: `${manageViewProjects.id}-${manageViewProjects.bidId}`,
    projectId: manageViewProjects.id,
    title: manageViewProjects.title,
    projectType: manageViewProjects.hourly
      ? ProjectTypeApi.HOURLY
      : ProjectTypeApi.FIXED,
    seoUrl: manageViewProjects.seoUrl,
    recruiter: manageViewProjects.recruiter,
    currencyCode: manageViewProjects.currencyCode,
    bidId: manageViewProjects.bidId,
    bidderId: manageViewProjects.bidderId,
    milestoneCount: manageViewProjects.milestoneCount,
    milestoneAmount: manageViewProjects.milestoneAmount,
    username: manageViewProjects.username,
    deadline: manageViewProjects.deadline * 1000,
    bidAmount: manageViewProjects.bidAmount,
    isHireMe: manageViewProjects.isHireMe,
    awardTime: manageViewProjects.awardTime * 1000,
  };
}
