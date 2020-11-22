import { SimilarTagCollectionBackendModel } from '../similar-tags/similar-tags.backend-model';
import { SimilarShowcases } from './similar-showcases.model';

export function transformSimilarShowcases(
  collection: SimilarTagCollectionBackendModel,
): SimilarShowcases {
  return collection;
}
