import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { UserTypeInfoCollection } from './user-type-info.types';

export function userTypeInfoBackend(): Backend<UserTypeInfoCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, document) => ({
      endpoint: 'user/updateUserTypeInfo.php',
      payload: {
        id: document.id,
        looking_for: document.lookingFor,
      },
      isGaf: true,
      asFormData: true,
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
