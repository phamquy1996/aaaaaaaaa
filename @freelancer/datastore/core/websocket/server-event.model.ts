/**
 * This file has the message formats for the different messages that are
 * received by the client from the websocket.
 *
 * Each websocket `message` contains an `event` that has a:
 *  - `type`,
 *  - `parent_type` and
 *  - `data`.
 *
 * These `events` are then reused by the `store` and `actions`.
 */
import { TimestampSeconds } from '../time/time.model';
import { WebsocketResource } from './message-send-event.model';
import { WebsocketMessagesEvent } from './server-messages-event.model';
import { WebsocketNotificationsEvent } from './server-notifications-event.model';
import { WebsocketOnlineOfflineEvent } from './server-online-offline-event.model';

export type WebsocketServerEvent =
  | ExpiringSubscription
  | SubMessageEvent
  | WebsocketMessage;

interface SubMessageEvent {
  readonly channel: 'subscribe';
  readonly body: 'OK';
}

export interface ExpiringSubscription {
  readonly channel: 'subscribe';
  readonly body: {
    readonly state: 'expiring';
    readonly resources: ReadonlyArray<WebsocketResource>;
  };
}

export type BaseServerData = TimestampSeconds & {
  readonly id: string;
  readonly type: string;
  readonly parent_type: string;
};

export type WebsocketEvent =
  | WebsocketNotificationsEvent
  | WebsocketOnlineOfflineEvent
  | WebsocketMessagesEvent;

export function isWebsocketMessage(
  event: WebsocketServerEvent,
): event is WebsocketMessage {
  return event.channel === 'user';
}

export function isWebsocketSubscriptionExpiring(
  event: WebsocketServerEvent,
): event is ExpiringSubscription {
  return (
    event.channel === 'subscribe' &&
    typeof event.body === 'object' &&
    event.body?.state === 'expiring'
  );
}

type BaseMessage = BaseServerData & {
  readonly channel: 'user';
  readonly body: {
    readonly aggregated: null;
    readonly display: boolean;
    readonly id: string;
    readonly is_important: boolean;
    readonly is_notification: boolean;
    readonly is_project: boolean;
    readonly message: string;
    readonly news_feed: boolean;
    readonly no_persist: boolean;
    readonly popup: boolean;
    readonly targets: ReadonlyArray<any>;
    readonly timestamp: number;
  };
};

export type WebsocketMessage = BaseMessage & {
  readonly body: BaseMessage['body'] & WebsocketEvent;
};
