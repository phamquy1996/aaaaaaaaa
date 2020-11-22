import { Pipe, PipeTransform } from '@angular/core';
import {
  OnlineOfflineUserStatus as DatastoreOnlineOfflineStatusObject,
  OnlineOfflineUserStatusValue as DatastoreOnlineOfflineStatus,
} from '@freelancer/datastore/collections';
import { assertNever } from '@freelancer/utils';

@Pipe({ name: 'isOnline' })
export class IsOnlinePipe implements PipeTransform {
  transform(
    user: { id: number },
    onlineOfflineStatuses: ReadonlyArray<
      DatastoreOnlineOfflineStatusObject
    > | null,
  ): boolean | undefined {
    if (!onlineOfflineStatuses) {
      return undefined;
    }

    const matchingStatus = onlineOfflineStatuses.find(
      status => status.id === user.id,
    );

    if (!matchingStatus) {
      return undefined;
    }

    switch (matchingStatus.status) {
      case DatastoreOnlineOfflineStatus.ONLINE:
        return true;
      case DatastoreOnlineOfflineStatus.OFFLINE:
        return false;
      default:
        return assertNever(matchingStatus.status);
    }
  }
}
