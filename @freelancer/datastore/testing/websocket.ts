import { Injectable } from '@angular/core';
import {
  WebsocketChannel,
  WebsocketEvent,
  WebsocketMessage,
  WebsocketServerEvent,
} from '@freelancer/datastore/core';
import * as Rx from 'rxjs';
import { generateId } from './seedHelpers/random';

interface GenerateWebsocketMessageOptions {
  readonly type: string;
  readonly parent_type: string;
  readonly timestamp: number;
}

@Injectable()
export class WebSocketServiceFake {
  fromServerStream$ = new Rx.Subject<WebsocketServerEvent>();

  setChannels(channels: ReadonlyArray<WebsocketChannel>) {
    // not implemented
  }

  /**
   * Send a websocket message.
   */
  sendMessage(event: WebsocketEvent, options: GenerateWebsocketMessageOptions) {
    const {
      type = 'private',
      parent_type = 'messages',
      timestamp = Math.floor(Date.now() / 1000),
    } = options;
    const id = generateId().toString();

    const message: WebsocketMessage = {
      channel: 'user',
      timestamp, // seconds
      id,
      type,
      parent_type,
      body: {
        aggregated: null,
        display: true,
        id,
        is_important: true,
        is_notification: false,
        is_project: false,
        message: 'mock',
        news_feed: false,
        no_persist: true,
        popup: true,
        targets: [],
        timestamp,
        ...event,
      },
    };

    this.fromServerStream$.next(message);
  }
}
