import { CategoryApi, JobApi } from 'api-typings/common/common';
import { Category, Skill } from './skills.model';

export function transformSkill(job: JobApi): Skill {
  if (!job.name || !job.seo_url) {
    throw new ReferenceError(`Job missing required fields`);
  }

  return {
    id: job.id,
    name: job.name,
    category: transformCategory(job.category),
    local: job.local || false,
    seoUrl: job.seo_url,
    activeProjectCount: job.active_project_count ? job.active_project_count : 0,
  };
}

function transformCategory(category?: CategoryApi): Category | undefined {
  return category
    ? {
        id: category.id,
        name: category.name,
      }
    : undefined;
}
