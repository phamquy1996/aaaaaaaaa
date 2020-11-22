import { toNumber } from '@freelancer/utils';
import { FrontendProjectStatusApi } from 'api-typings/common/common';
import { ProjectApi } from 'api-typings/projects/projects';
import { transformCurrency } from '../currencies/currencies.transformers';
import { NearbyProject } from './nearby-projects.model';

export function transformNearbyProjects(result: ProjectApi): NearbyProject {
  if (
    !result.currency ||
    !result.jobs ||
    !result.language ||
    !result.location ||
    !result.budget ||
    !result.seo_url ||
    !result.submitdate ||
    result.location.latitude === undefined ||
    result.location.longitude === undefined ||
    result.user_distance === undefined
  ) {
    throw new Error('Missing fields for nearby projects transformer.');
  }

  return {
    currency: transformCurrency(result.currency),
    description: result.description || '',
    id: toNumber(result.id),
    skillIds: result.jobs.map(skill => skill.id),
    languageCode: result.language,
    local: true,
    location: {
      latitude: result.location.latitude,
      longitude: result.location.longitude,
      country: result.location.country
        ? result.location.country.name
        : undefined,
      city: result.location.city
        ? result.location.city
        : result.location.vicinity,
    },
    maxBudget: result.budget.maximum,
    minBudget: result.budget.minimum,
    seoUrl: result.seo_url,
    status: FrontendProjectStatusApi.OPEN,
    submitdate: result.submitdate * 1000,
    title: result.title,
    userDistance: result.user_distance,
  };
}
