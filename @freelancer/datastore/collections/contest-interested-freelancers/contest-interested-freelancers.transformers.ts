import { ContestInterestedFreelancerAjax } from './contest-interested-freelancers.backend-model';
import { ContestInterestedFreelancer } from './contest-interested-freelancers.model';

export function transformContestInterestedFreelancer(
  contestInterestedFreelancer: ContestInterestedFreelancerAjax,
): ContestInterestedFreelancer {
  return {
    id: contestInterestedFreelancer.id,
    contestId: contestInterestedFreelancer.contest_id,
    createDate: contestInterestedFreelancer.create_date * 1000,
    publicName: contestInterestedFreelancer.public_name,
    profileUrl: `/u/${contestInterestedFreelancer.username}`,
    username: contestInterestedFreelancer.username,
  };
}
