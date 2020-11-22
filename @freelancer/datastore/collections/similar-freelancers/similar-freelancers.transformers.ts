import { SimilarTagCollectionBackendModel } from '../similar-tags/similar-tags.backend-model';
import { SimilarFreelancers } from './similar-freelancers.model';

export function transformSimilarFreelancers(
  collection: SimilarTagCollectionBackendModel,
): SimilarFreelancers {
  return collection;
}
