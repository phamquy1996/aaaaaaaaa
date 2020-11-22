import { DeveloperApplicationApi } from 'api-typings/users/users';
import { transformApplicationScopes } from '../application-scopes/application-scopes.transformers';
import { DeveloperApplication } from './developer-applications.model';

export function transformDeveloperApplication(
  developerApplication: DeveloperApplicationApi,
): DeveloperApplication {
  return {
    id: developerApplication.id,
    name: developerApplication.name,
    userId: developerApplication.user_id,
    timeCreated: developerApplication.time_created * 1000,
    approved: developerApplication.approved,
    disabled: developerApplication.disabled,
    description: developerApplication.description,
    homepageUrl: developerApplication.homepage_url,
    redirectUrl: developerApplication.redirect_url,
    businessModel: developerApplication.business_model,
    userLimit: developerApplication.user_limit,
    scopes: developerApplication.scopes,
    secret: developerApplication.secret,
    advancedScopes: developerApplication.advanced_scopes
      ? developerApplication.advanced_scopes.map(transformApplicationScopes)
      : [],
  };
}
