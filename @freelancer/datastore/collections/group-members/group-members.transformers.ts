import { GroupMemberApi } from 'api-typings/groups/groups';
import { GroupMember } from './group-members.model';

export function transformGroupMember(groupMember: GroupMemberApi): GroupMember {
  return {
    id: groupMember.id,
    // Due to some race condition bug with the Datastore we can not use
    // `ids` when specifying another filter, such as `groupId`. We
    // suspect that this is a bug related to batching `ids` logic within
    // the Datastore.
    memberId: groupMember.id,
    groupId: groupMember.group_id,
    userId: groupMember.user_id,
    role: groupMember.role,
    isRemoved: groupMember.is_removed,
    created: groupMember.created,
    updated: groupMember.updated,
  };
}
