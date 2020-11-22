import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { toNumber } from '@freelancer/utils';
import { GroupMembersCollection } from './group-members.types';

export function groupMembersBackend(): Backend<GroupMembersCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order, resourceGroup) => {
      const groupId = resourceGroup
        ? resourceGroup.groupId
        : getQueryParamValue(query, 'groupId')[0];
      if (!groupId) {
        throw new Error(
          "Undefined groupdId was given during fetching group's members",
        );
      }
      return {
        endpoint: `groups/0.1/groups/${groupId}/members`,
        isGaf: false,
        params: {
          roles: getQueryParamValue(query, 'role'),
          users: getQueryParamValue(query, 'userId'),
          members: [
            // Due to some race condition bug with the Datastore we can not use
            // `ids` when specifying another filter, such as `groupId`. We
            // suspect that this is a bug related to batching `ids` logic within
            // the Datastore.
            ...(ids || []).map(toNumber),
            ...getQueryParamValue(query, 'memberId'),
          ],
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
