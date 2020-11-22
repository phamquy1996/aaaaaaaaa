import { JobBundleApi } from 'api-typings/projects/projects';
import { SkillBundle } from './skill-bundles.model';

export function transformSkillBundle(bundle: JobBundleApi): SkillBundle {
  if (!bundle.id || !bundle.job_bundle_category_id) {
    throw new ReferenceError('Missing a required skill bundle field');
  }

  return {
    category: bundle.job_bundle_category_id,
    id: bundle.id,
    languageCode: 'en',
    name: bundle.name,
    skillIds: bundle.jobs,
    subcategory: bundle.id,
  };
}
