import { generateId } from '@freelancer/datastore/testing';
import { EntityTypeApi } from 'api-typings/common/common';
import { GrantedPermissionApi } from 'api-typings/grants/grants';
import { Enterprise, Pool } from '../enterprise';
import { Grant, GrantEntity } from './grants.model';

/**
 * Enum for Different Roles and their associated permissions in the DB.
 * From `superuser_role` table in GAF
 */
export enum GrantRole {
  FREELANCER_STAFF = 4,
}

export const allGrantedPermissions: ReadonlyArray<GrantedPermissionApi> = [
  GrantedPermissionApi.VIEW_USER_PERSONAL_DETAILS,
  GrantedPermissionApi.VIEW_ALL_PROJECTS,
  GrantedPermissionApi.VIEW_PROJECT_MILESTONES,
  GrantedPermissionApi.VIEW_PROJECT_THREADS,
  GrantedPermissionApi.VIEW_PROJECT_ATTACHMENTS,
  GrantedPermissionApi.VIEW_PROJECT_NDA_DETAILS,
  GrantedPermissionApi.VIEW_MARKETPLACE_STATS,
  GrantedPermissionApi.VIEW_PRIVATE_BIDS,
  GrantedPermissionApi.CREATE_PROJECT_COLLABORATION,
  GrantedPermissionApi.VIEW_SUPPORT_SESSIONS,
];

export interface GenerateGrantItemOptions {
  readonly resource: GrantEntity;
  readonly entity: GrantEntity;
  readonly grantingEntity?: GrantEntity;
  readonly roleId?: GrantRole;
  readonly grantedPermissions?: ReadonlyArray<GrantedPermissionApi>;
}

export function grantEnterprise(
  userId: number,
  enterpriseId: Enterprise,
): Pick<GenerateGrantItemOptions, 'resource' | 'entity'> {
  return {
    entity: {
      id: userId,
      entityType: EntityTypeApi.USER,
    },
    resource: {
      id: enterpriseId,
      entityType: EntityTypeApi.ENTERPRISE,
    },
  };
}

export function grantPool(userId: number, poolId: Pool) {
  return {
    entity: {
      id: userId,
      entityType: EntityTypeApi.USER,
    },
    resource: {
      id: poolId,
      entityType: EntityTypeApi.POOL,
    },
  };
}

export function generateGrantItem({
  resource,
  entity,
  grantingEntity = { id: 1, entityType: EntityTypeApi.ADMIN },
  roleId = GrantRole.FREELANCER_STAFF,
  grantedPermissions = allGrantedPermissions,
}: GenerateGrantItemOptions): Grant {
  const roleName = GrantRole[roleId];

  return {
    id: generateId(),
    resource,
    grantingEntity,
    entity,
    roleId,
    roleName,
    grantedPermissions,
  };
}

export function generateGrantsObjects(
  grantItemOptionsList: ReadonlyArray<GenerateGrantItemOptions>,
): ReadonlyArray<Grant> {
  return grantItemOptionsList.map(grantItemOptions =>
    generateGrantItem(grantItemOptions),
  );
}
