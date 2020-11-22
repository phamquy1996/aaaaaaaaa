import { ProjectOfferApi } from './project-offer.backend-model';
import { ProjectOffer } from './project-offer.model';

export function transformProjectOffer(
  projectOffer: ProjectOfferApi,
): ProjectOffer {
  return {
    id: projectOffer.id,
    awardStatus: projectOffer.awardStatus,
    freelancerId: projectOffer.sellerId,
    projectId: projectOffer.projectId,
  };
}
