import { generateId } from '@freelancer/datastore/testing';
import { GroupMemberRoleApi } from 'api-typings/groups/groups';
import { GroupMember } from './group-members.model';

export interface GenerateGroupMemberOptions {
  readonly groupId: number;
  readonly userId: number;
  readonly role?: GroupMemberRoleApi;
  readonly created?: number;
  readonly isRemoved?: boolean;
  readonly updated?: number;
}

function generateGroupMemberObject({
  groupId,
  userId,
  role = GroupMemberRoleApi.MEMBER,
  created = Date.now(),
  isRemoved = false,
  updated,
}: GenerateGroupMemberOptions): GroupMember {
  const id = generateId();
  return {
    id,
    memberId: id,
    groupId,
    userId,
    role,
    created,
    isRemoved,
    updated,
  };
}

export function generateGroupMembersObject(
  members: ReadonlyArray<GenerateGroupMemberOptions>,
): ReadonlyArray<GroupMember> {
  return members.map(generateGroupMemberObject);
}
