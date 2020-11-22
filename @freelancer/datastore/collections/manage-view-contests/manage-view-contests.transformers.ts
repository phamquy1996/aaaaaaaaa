import { ManageViewContestsItemAjax } from './manage-view-contests.backend-model';
import { ManageViewContest } from './manage-view-contests.model';

export function transformManageViewContestsItem(
  manageViewContests: ManageViewContestsItemAjax,
): ManageViewContest {
  return {
    id: manageViewContests.id,
    title: manageViewContests.title,
    seoUrl: manageViewContests.seoUrl,
    ownerId: manageViewContests.ownerId,
    entryCount: manageViewContests.entryCount,
    prize: manageViewContests.prize,
    currencyCode: manageViewContests.currencyCode,
    timeEnded: manageViewContests.timeEnded
      ? manageViewContests.timeEnded * 1000
      : undefined,
    status: manageViewContests.status,
  };
}
