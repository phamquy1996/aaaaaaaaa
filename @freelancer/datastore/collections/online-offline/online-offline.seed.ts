import {
  generateArrayWithValues,
  randomiseList,
} from '@freelancer/datastore/testing';
import {
  OnlineOfflineUserStatus,
  OnlineOfflineUserStatusValue,
} from './online-offline.model';

export interface GenerateOnlineOfflineOptions {
  readonly userIds: ReadonlyArray<number>;
  readonly percentOnline?: number;
}

export function generateOnlineOfflineObjects({
  userIds,
  percentOnline = 50,
}: GenerateOnlineOfflineOptions): ReadonlyArray<OnlineOfflineUserStatus> {
  // Generate a third of the reviews as blank ones.
  const numberOnline = Math.floor((userIds.length * percentOnline) / 100);

  const statuses = randomiseList(
    [
      ...generateArrayWithValues(
        numberOnline,
        OnlineOfflineUserStatusValue.ONLINE,
      ),
      ...generateArrayWithValues(
        userIds.length - numberOnline,
        OnlineOfflineUserStatusValue.OFFLINE,
      ),
    ],
    'onlineOfflineStatuses',
  );

  return userIds.map((freelancerId, i) => ({
    id: freelancerId,
    status: statuses[i],
  }));
}
