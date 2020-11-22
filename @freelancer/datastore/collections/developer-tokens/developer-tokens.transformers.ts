import { BearerTokenApi } from 'api-typings/users/users';
import { transformApplicationScopes } from '../application-scopes/application-scopes.transformers';
import { DeveloperToken } from './developer-tokens.model';

export function transformDeveloperToken(
  developerToken: BearerTokenApi,
): DeveloperToken {
  return {
    id: `${developerToken.id}`,
    applicationId: developerToken.application_id,
    userId: developerToken.user_id,
    tokenType: developerToken.token_type,
    accessToken: developerToken.access_token,
    expires: developerToken.expires,
    refreshToken: developerToken.refresh_token,
    advancedScopes: (developerToken.advanced_scopes || []).map(
      transformApplicationScopes,
    ),
  };
}
