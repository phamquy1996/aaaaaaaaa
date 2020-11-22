import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { EnterpriseSourceApi } from 'api-typings/common/common';
import { MarketingMobileNumberRequestApi } from 'api-typings/users/users';
import { Enterprise } from '../enterprise/enterprise.model';
import {
  EnterpriseUpdatePayload,
  ProfileUpdatePayload,
} from './users-self.model';
import { UsersSelfCollection } from './users-self.types';

export function usersSelfBackend(): Backend<UsersSelfCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    // FIXME: T50039 This endpoint doesn't appear to be ordered in the backend
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'users/0.1/self',
      params: {
        status: 'true',
        marketing_mobile_number: true,
        limited_account: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, delta, original) => {
      let payload:
        | EnterpriseUpdatePayload
        | ProfileUpdatePayload
        | MarketingMobileNumberRequestApi
        | undefined;
      let endpoint = 'users/0.1/self/profile';

      if (delta.hasLinkedEscrowComAccount === true) {
        payload = {
          action: 'escrowcom_link_consent',
        };
        endpoint = 'users/0.1/self';
      }

      if (delta.primaryLanguage) {
        if (payload) {
          throw new Error('Cannot update two or more fields at once.');
        }
        payload = {
          primary_language: delta.primaryLanguage,
        };
      }

      if (delta.marketingMobileNumber) {
        if (payload) {
          throw new Error('Cannot update two or more fields at once.');
        }

        const { marketingMobileNumber } = delta;
        if (
          !marketingMobileNumber.phoneNumber ||
          !marketingMobileNumber.countryCode
        ) {
          throw new Error('Invalid marketing mobile number.');
        }
        return {
          endpoint: `users/0.1/self/marketing_mobile_number`,
          method: 'POST',
          payload: {
            phone_number: marketingMobileNumber.phoneNumber,
            country_code: marketingMobileNumber.countryCode,
          },
        };
      }

      if (
        delta.enterpriseIds?.includes(Enterprise.FACEBOOK) &&
        (original.enterpriseIds
          ? !original.enterpriseIds.includes(Enterprise.FACEBOOK)
          : true)
      ) {
        if (payload) {
          throw new Error('Cannot update two or more fields at once.');
        }

        const enterprise = Enterprise.FACEBOOK;
        const source = EnterpriseSourceApi.FACEBOOK;

        return {
          endpoint: 'users/0.1/self/',
          method: 'PUT',
          params: {
            action: 'add_enterprise',
          },
          payload: {
            enterprise,
            source,
          },
        };
      }

      if (!payload) {
        throw new Error('Nothing to be updated.');
      }

      return { endpoint, method: 'PUT', payload };
    },
    remove: undefined,
  };
}
