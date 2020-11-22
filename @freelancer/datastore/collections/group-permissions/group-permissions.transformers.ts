import { GroupRolePermissionSelfGetResultApi } from 'api-typings/groups/groups';
import { GroupPermissions } from './group-permissions.model';

export function transformGroupPermissions(
  groupPermissions: GroupRolePermissionSelfGetResultApi,
): GroupPermissions {
  return {
    id: groupPermissions.group_id,
    permissions: groupPermissions.permissions,
  };
}
