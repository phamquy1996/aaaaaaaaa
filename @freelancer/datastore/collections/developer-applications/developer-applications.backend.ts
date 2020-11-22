import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isDefined, toNumber } from '@freelancer/utils';
import { ApplicationScope } from '../application-scopes/application-scopes.model';
import { DeveloperApplicationsCollection } from './developer-applications.types';

export function developerApplicationsBackend(): Backend<
  DeveloperApplicationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/developer_applications',
      isGaf: false,
      params: {
        application_ids: ids,
        disabled: getQueryParamValue(query, 'disabled')[0],
      },
    }),
    push: (authUid, application) => ({
      endpoint: 'users/0.1/developer_applications',
      isGaf: false,
      asFormData: true,
      payload: {
        name: application.name,
        user_id: toNumber(authUid),
        description: application.description,
        homepage_url: application.homepageUrl,
        redirect_url: application.redirectUrl,
        business_model: application.businessModel,
        user_limit: application.userLimit,
        scopes: application.scopes,
        advanced_scopes: (application.advancedScopes || []).map(
          scope => scope.name,
        ),
      },
    }),
    set: undefined,
    update: (authUid, application, original) => {
      /**
       * The revoking can't really be done with `remove` flow, because we need to
       * pass in the `disabledReason`, so we have to do it via `update`.
       * To do it via `update` we need to pass in the whole payload, which is not ideal,
       * but doable.
       */
      if (application.disabled) {
        // we're doing the removing flow
        return {
          endpoint: `users/0.1/developer_applications/${original.id}/disable`,
          method: 'PUT',
          asFormData: false,
          payload: {
            // ugh, we don't need any of those fields
            id: original.id,
            name: original.name,
            user_id: toNumber(authUid),
            description: original.description,
            homepage_url: original.homepageUrl,
            redirect_url: original.redirectUrl,
            business_model: original.businessModel,
            user_limit: original.userLimit,
            // advanced_scopes: original.advancedScopes,
            // the only fields we actually need
            disabled: true,
            disabled_reason: application.disabledReason,
          },
        };
      }
      const advancedScopes = (
        application.advancedScopes ||
        original.advancedScopes ||
        []
      ).filter(isDefined);
      return {
        endpoint: `users/0.1/developer_applications/${original.id}`,
        method: 'PUT',
        asFormData: true,
        payload: {
          id: original.id,
          name: original.name,
          user_id: toNumber(authUid),
          scopes: original.scopes,
          description: application.description || original.description,
          homepage_url: application.homepageUrl || original.homepageUrl,
          redirect_url: application.redirectUrl || original.redirectUrl,
          business_model: application.businessModel || original.businessModel,
          user_limit: application.userLimit || original.userLimit,
          // casting is necessary because datastore automatically claims they're partial objects
          // in this case they're immutable, so the casting should be safe
          advanced_scopes: ((advancedScopes || []) as ApplicationScope[]).map(
            scope => scope.name,
          ),
        },
      };
    },
    remove: undefined,
  };
}
