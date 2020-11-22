import { AdvancedScopeApi } from 'api-typings/users/users';
import { ApplicationScope } from './application-scopes.model';

export function transformApplicationScopes(
  advancedScope: AdvancedScopeApi,
): ApplicationScope {
  return {
    id: advancedScope.id,
    clientId: advancedScope.client_id,
    name: advancedScope.name,
    description: advancedScope.description,
  };
}

export function transformApplicationScopesApi(
  advancedScope: ApplicationScope,
): AdvancedScopeApi {
  return {
    id: advancedScope.id,
    client_id: advancedScope.clientId,
    name: advancedScope.name,
    description: advancedScope.description,
  };
}
