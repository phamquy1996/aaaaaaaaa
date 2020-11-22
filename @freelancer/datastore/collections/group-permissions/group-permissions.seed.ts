import { GroupPermissionApi } from 'api-typings/groups/groups';
import { GroupPermissions } from './group-permissions.model';

export interface GenerateGroupPermissionsOptions {
  readonly groupId: number;
  readonly permissions: ReadonlyArray<GroupPermissionApi>;
}

export function generateGroupPermissionsObject({
  groupId,
  permissions,
}: GenerateGroupPermissionsOptions): ReadonlyArray<GroupPermissions> {
  return [
    {
      id: groupId,
      permissions,
    },
  ];
}
