import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { CustomFieldInfoConfigurationsCollection } from './custom-field-info-configurations.types';

export function customFieldInfoConfigurationsBackend(): Backend<
  CustomFieldInfoConfigurationsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => ({
      endpoint: 'common/0.1/enterprise_metadata_fields',
      isGaf: false,
      params: {
        resource_type: getQueryParamValue(query, 'resourceType')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
