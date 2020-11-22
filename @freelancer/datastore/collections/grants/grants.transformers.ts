import { EntityApi } from 'api-typings/common/common';
import { GrantApi } from 'api-typings/grants/grants';
import { Grant, GrantEntity } from './grants.model';

export function transformGrant(grant: GrantApi): Grant {
  if (
    !grant.id ||
    !grant.resource ||
    !grant.granting_entity ||
    !grant.entity ||
    !grant.role ||
    !grant.role.id ||
    !grant.role.name ||
    !grant.role.granted_permissions
  ) {
    throw new ReferenceError(`Missing a required grant field.`);
  }

  return {
    id: grant.id,
    resource: transformEntity(grant.resource),
    grantingEntity: transformEntity(grant.granting_entity),
    entity: transformEntity(grant.entity),
    roleId: grant.role.id,
    roleName: grant.role.name,
    grantedPermissions: grant.role.granted_permissions,
  };
}

function transformEntity(entity: EntityApi): GrantEntity {
  if (!entity.id || !entity.entity_type) {
    throw new ReferenceError(`Missing a required grant field.`);
  }
  return {
    id: entity.id,
    entityType: entity.entity_type,
  };
}
