import { generateId } from '@freelancer/datastore/testing';
import { GroupCreatorTypeApi, GroupTypeApi } from 'api-typings/groups/groups';
import { Group } from './groups.model';

export interface GenerateGroupOptions {
  readonly name: string;
  readonly creatorType?: GroupCreatorTypeApi;
  readonly groupType?: GroupTypeApi;
  readonly description?: string;
  readonly created?: number;
  readonly isDeleted?: boolean;
  readonly updated?: number;
}

function generateGroupObject({
  name,
  creatorType = GroupCreatorTypeApi.ADMIN,
  groupType = GroupTypeApi.TALENT_POOL,
  description,
  created = Date.now(),
  isDeleted = false,
  updated,
}: GenerateGroupOptions): Group {
  const id = generateId();
  return {
    id,
    name,
    creatorId: generateId(),
    creatorType,
    seoUrl: `group-${id}`,
    groupType,
    description,
    created,
    isDeleted,
    updated,
  };
}

export function generateGroupsObject(
  groups: ReadonlyArray<GenerateGroupOptions>,
): ReadonlyArray<Group> {
  return groups.map(generateGroupObject);
}
