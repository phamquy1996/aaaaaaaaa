/* A wrapper around SockJS so that we make sure that we only
 * send messages of types that our backend supports.
 *
 * Contains both the types of messages sent and received as well as
 * helper functions to construct these.
 */

import { AuthState } from '@freelancer/auth';
import { assertNever } from '@freelancer/utils';
import { ResourceTypeApi } from 'api-typings/gotifications/gotifications';
import * as SockJS from 'sockjs-client';
import {
  AuthSubMessage,
  ChannelSubMessage,
  OnlineOfflineSubUnsubMessage,
  ResourceSubMessage,
  ResourceUnsubMessage,
  SockMessageSend,
  WebsocketChannel,
  WebsocketResource,
} from './message-send-event.model';

interface SockBaseRawEvent {
  readonly type: string;
}

type SockOpenRawEvent = SockBaseRawEvent;

interface SockCloseRawEvent extends SockBaseRawEvent {
  readonly code: number;
  readonly reason: string;
  readonly wasClean: boolean;
}

interface SockMessageRawEvent extends SockBaseRawEvent {
  readonly data: string;
}

enum State {
  CONNECTING = 0,
  OPEN,
  CLOSING,
  CLOSED,
}

export function generateOnlineOfflineSub(
  userIds: ReadonlyArray<number>,
): OnlineOfflineSubUnsubMessage {
  return {
    channel: 'onlineoffline',
    body: {
      route: 'getsub',
      users: userIds,
    },
  };
}

export function generateOnlineOfflineUnsub(
  userIds: ReadonlyArray<number>,
): OnlineOfflineSubUnsubMessage {
  return {
    channel: 'onlineoffline',
    body: {
      route: 'unsub',
      users: userIds,
    },
  };
}

export function generateChannelSubMessage(
  channels: ReadonlyArray<WebsocketChannel>,
): ChannelSubMessage {
  return {
    channel: 'channels',
    body: { channels },
  };
}

function getResourceTypeEnum(resource: ResourceTypeApi | number) {
  if (typeof resource === 'number') {
    return resource;
  }

  switch (resource) {
    case ResourceTypeApi.PROJECT_OWNER:
      return 0;
    case ResourceTypeApi.PROJECT:
      return 1;
    case ResourceTypeApi.BID:
      return 2;
    case ResourceTypeApi.THREAD:
      return 3;
    case ResourceTypeApi.TEST_RESOURCE:
      return 4;
    case ResourceTypeApi.GROUP:
      return 5;
    default:
      assertNever(resource);
  }
}

export function generateResourcesSubMessage(
  resources: ReadonlyArray<WebsocketResource>,
): ResourceSubMessage {
  const channels = resources.map(
    r => `channel_resource_${getResourceTypeEnum(r.type)}_${r.id}`,
  );
  return {
    channel: 'channels',
    body: { channels },
  };
}

export function generateResourcesUnsubMessage(
  resources: ReadonlyArray<WebsocketResource>,
): ResourceUnsubMessage {
  return {
    channel: 'resource',
    body: {
      route: 'unsub',
      resources: resources.map(resource => ({
        type: getResourceTypeEnum(resource.type),
        id: resource.id,
      })),
    },
  };
}

export function generateHeader(auth: AuthState): AuthSubMessage {
  return {
    channel: 'auth',
    body: {
      hash2: auth.token,
      user_id: parseInt(auth.userId, 10),
    },
  };
}
export class Socket {
  private sock: any; // SockJS doesn't export its type.
  public onopen: (e: SockOpenRawEvent) => any;
  public onclose: (e: SockCloseRawEvent) => any;
  public onmessage: (e: SockMessageRawEvent) => any;

  constructor(url: string) {
    this.sock = new SockJS(url);
    this.sock.onopen = (e: SockOpenRawEvent) => this.onopen(e);
    this.sock.onclose = (e: SockCloseRawEvent) => this.onclose(e);
    this.sock.onmessage = (e: SockMessageRawEvent) => this.onmessage(e);
  }

  public readyState(): State {
    return this.sock.readyState;
  }

  public send(message: SockMessageSend): void {
    this.sock.send(JSON.stringify(message));
  }

  public close(code?: number, reason?: string): void {
    this.sock.close(code, reason);
  }
}
