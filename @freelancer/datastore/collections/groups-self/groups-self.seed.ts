import { Group } from '../groups/groups.model';

export interface GenerateGroupSelfOptions {
  readonly groups: ReadonlyArray<Group>;
}

export function generateGroupsSelf({
  groups,
}: GenerateGroupSelfOptions): ReadonlyArray<Group> {
  return groups;
}
