import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { TagFamilyMembersCollection } from './tag-family-members.types';

export function tagFamilyMembersBackend(): Backend<TagFamilyMembersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'discover/tagFamilyMembers.php',
      isGaf: true,
      params: {},
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
