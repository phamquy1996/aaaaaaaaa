import {
  WebsocketOnlineOfflineStatusChangeEvent,
  WebsocketOnlineOfflineSubscribeEvent,
} from '@freelancer/datastore/core';
import { assertNever, toNumber } from '@freelancer/utils';
import { OnlineOfflineUserStatusValueApi } from './online-offline.backend-model';
import {
  OnlineOfflineUserStatus,
  OnlineOfflineUserStatusValue,
} from './online-offline.model';

export function transformOnlineOfflineStatusType(
  status: OnlineOfflineUserStatusValueApi,
): OnlineOfflineUserStatusValue {
  switch (status) {
    case OnlineOfflineUserStatusValueApi.ONLINE:
      return OnlineOfflineUserStatusValue.ONLINE;
    case OnlineOfflineUserStatusValueApi.OFFLINE:
      return OnlineOfflineUserStatusValue.OFFLINE;
    default:
      return assertNever(status);
  }
}

export function transformOnlineOfflineStatusFetch<
  T extends keyof WebsocketOnlineOfflineSubscribeEvent['data']
>([userId, status]: [
  T,
  WebsocketOnlineOfflineSubscribeEvent['data'][T],
]): OnlineOfflineUserStatus {
  return {
    id: toNumber(userId),
    status: transformOnlineOfflineStatusType(status),
  };
}

export function transformOnlineOfflineStatusChange(
  data: WebsocketOnlineOfflineStatusChangeEvent['data'],
): OnlineOfflineUserStatus {
  return {
    id: data.user,
    status: transformOnlineOfflineStatusType(data.to),
  };
}
