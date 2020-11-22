import { UserCalifornianStatus } from './user-californian-statuses.model';

export interface GenerateUserCalifornianStatusesOptions {
  readonly userIds: ReadonlyArray<number>;
}

// TODO: Make this toggleable when we begin testing Cali
export function generateUserCalifornianStatusObjects({
  userIds,
}: GenerateUserCalifornianStatusesOptions): ReadonlyArray<
  UserCalifornianStatus
> {
  return userIds.map(id => ({
    id: id.toString(),
    ip: '204.236.225.72',
    isUserPotentiallyCalifornian: false,
    isUserCalifornian: false,
  }));
}
