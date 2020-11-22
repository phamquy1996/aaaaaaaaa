import { OnlineOfflineStatusApi as OnlineOfflineUserStatusValue } from 'api-typings/users/users';

// fix when https://github.com/Microsoft/TypeScript/issues/1166
export { OnlineOfflineUserStatusValue };

/**
 * Indicates whether a user is online or offline.
 *
 * Received down the Websocket.
 */
export interface OnlineOfflineUserStatus {
  readonly id: number;
  readonly status: OnlineOfflineUserStatusValue;
}
