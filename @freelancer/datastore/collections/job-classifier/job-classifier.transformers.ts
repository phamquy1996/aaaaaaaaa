import { JobClassifierGetResult } from './job-classifier.backend-model';
import { JobClassifier } from './job-classifier.model';

export function transformJobClassifier(
  jobClassifier: JobClassifierGetResult,
): JobClassifier {
  return {
    id: jobClassifier.id,
    skillIds: jobClassifier.jobs,
    category: jobClassifier.category,
  };
}
