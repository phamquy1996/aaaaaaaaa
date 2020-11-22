import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { CustomFieldValueUpdatePayload } from '../custom-field-info-configurations/custom-field-info-configurations.model';
import { transformEnterpriseMetadataValuePayload } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import { UsersCollection } from './users.types';

export function usersBackend(): Backend<UsersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    }, // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: `users/0.1/users`,
      params: {
        users: ids,
        usernames: getQueryParamValue(query, 'username'),
        avatar: 'true',
        online_offline_details: 'true',
        status: 'true',
        support_status_details: 'true',
        limited_account: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, delta, originalUser) => {
      // This will update all custom field value that is set in the payload.
      // This means any exsting custom field value or custom value which
      // is currently undefined, will be updated.
      let payload: CustomFieldValueUpdatePayload | undefined;

      const customFieldValues = delta.customFieldValues
        ? delta.customFieldValues.filter(isDefined)
        : undefined;

      if (customFieldValues === undefined) {
        throw new Error('No custom fields to update.');
      }

      if (payload) {
        throw new Error('Cannot update two fields at once');
      }
      payload = {
        enterprise_metadata_values: customFieldValues.map(customFieldValue =>
          transformEnterpriseMetadataValuePayload(customFieldValue),
        ),
      };

      return {
        endpoint: 'users/0.1/self/enterprise_metadata_fields',
        method: 'POST',
        payload,
      };
    },
    remove: undefined,
  };
}
