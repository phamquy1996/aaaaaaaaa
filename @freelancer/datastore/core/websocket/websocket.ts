/**
 * A library for working with SockJS websockets.
 *
 * This is somewhat based on rxjs-websockets but with a lot of customisations
 * for freelancer.
 */
import { Inject, Injectable, NgZone } from '@angular/core';
import { Auth } from '@freelancer/auth';
import { Timer, TimeUtils } from '@freelancer/time-utils';
import { Tracking } from '@freelancer/tracking';
import { toNumber } from '@freelancer/utils';
import { Store } from '@ngrx/store';
import { ResourceTypeApi } from 'api-typings/gotifications/gotifications';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  first,
  map,
  mapTo,
  pairwise,
  startWith,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { TypedAction } from '../actions';
import { DATASTORE_CONFIG } from '../datastore.config';
import { DatastoreConfig } from '../datastore.interface';
import { setDiff } from '../helpers';
import { startWithEmptyList } from '../operators';
import { StoreState } from '../store.model';
import {
  SockMessageSend,
  WebsocketChannel,
  WebsocketResource,
} from './message-send-event.model';
import { MultiSet } from './multiset';
import {
  ExpiringSubscription,
  isWebsocketMessage,
  isWebsocketSubscriptionExpiring,
  WebsocketEvent,
  WebsocketMessage,
  WebsocketServerEvent,
} from './server-event.model';
import {
  generateChannelSubMessage,
  generateHeader,
  generateOnlineOfflineSub,
  generateOnlineOfflineUnsub,
  generateResourcesSubMessage,
  generateResourcesUnsubMessage,
  Socket,
} from './sock-js';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private sock: Socket;
  private connectionStatus$ = new Rx.BehaviorSubject<number>(0);

  // FIXME: Make private and expose a public observable
  public fromServerStream$ = new Rx.Subject<WebsocketServerEvent>();

  private open = false;
  private channelSubscriptions = new Set<WebsocketChannel>();
  private resourcesSubscriptions = new MultiSet<WebsocketResource>();
  private onlineOfflineSubscriptions = new MultiSet<number>();
  private unsubDebounceTime?: Timer; // TODO: T35544
  private connectRetryCount = 0;

  private TRACKING_RETRY_COUNT_THRESHOLD = 5;
  private TRACKING_RETRY_COUNT_DEBOUNCE = 10;

  constructor(
    @Inject(DATASTORE_CONFIG) private datastoreConfig: DatastoreConfig,
    private auth: Auth,
    private tracking: Tracking,
    private store$: Store<StoreState>,
    private timeUtils: TimeUtils,
    private ngZone: NgZone,
  ) {
    this.create();
  }

  private create(isReconnect: boolean = false) {
    this.auth.authState$.pipe(distinctUntilChanged()).subscribe(auth => {
      this.open = false;

      // FIXME: handle logged-out / logging-out
      if (!auth) {
        return;
      }

      const closed = () => {
        if (!this.open) {
          return;
        }

        this.connectionStatus$.next(this.connectionStatus$.getValue() - 1);
        this.open = false;
      };

      this.ngZone.runOutsideAngular(() => {
        this.sock = new Socket(this.datastoreConfig.webSocketUrl);

        this.sock.onopen = () => {
          this.ngZone.run(() => {
            this.open = true;
            this.connectRetryCount = 0;
            this.connectionStatus$.next(this.connectionStatus$.getValue() + 1);
            this.sendEvent(generateHeader(auth));
            this.subscribeToEvents();

            if (isReconnect) {
              this.tracking.trackCustomEvent('WS.ON_OPEN', 'WS_CONN_EVENT');
            }
          });
        };

        // Only send events with actual messages, not handshaking messages.
        this.sock.onmessage = event => {
          this.ngZone.run(() => {
            this.processEvent(JSON.parse(event.data), auth.userId);
          });
        };

        this.sock.onclose = event => {
          this.ngZone.run(() => {
            closed();
            if (event.wasClean) {
              this.fromServerStream$.complete();
            } else {
              // retryDelay is capped to ~30 seconds
              const retryDelayFactor = Math.min(this.connectRetryCount, 5);
              // FIXME: use global error toast service to display something when
              // the websocket is reconnecting (and let the user force reconnect?)
              const retryDelay =
                2 ** retryDelayFactor * 1000 + Math.round(Math.random() * 1000);
              console.warn(
                `websocket disconnected, retrying in ${retryDelay}ms (retryCount: ${this.connectRetryCount})`,
              );

              if (
                this.shouldTrackWebsocketDisconnectionEvent(
                  this.connectRetryCount,
                )
              ) {
                this.tracking.trackCustomEvent('WS.ON_CLOSE', 'WS_CONN_EVENT', {
                  retryDelay,
                  retryCount: this.connectRetryCount,
                });
              }
              // race between the retry timeout & the online event..
              Rx.race(
                this.timeUtils.rxTimer(retryDelay).pipe(
                  tap(() => {
                    this.connectRetryCount++;
                    console.warn('reconnecting (timeout)...');
                    if (
                      this.shouldTrackWebsocketDisconnectionEvent(
                        this.connectRetryCount,
                      )
                    ) {
                      this.tracking.trackCustomEvent(
                        'WS.ON_CLOSE.RETRY_DELAY_ELAPSED',
                        'WS_CONN_EVENT',
                      );
                    }
                  }),
                  mapTo(true),
                ),
                Rx.fromEvent(window, 'online').pipe(
                  tap(() => {
                    this.connectRetryCount = 0;
                    console.warn('reconnecting (online event)...');
                    if (
                      this.shouldTrackWebsocketDisconnectionEvent(
                        this.connectRetryCount,
                      )
                    ) {
                      this.tracking.trackCustomEvent(
                        'WS.ONCLOSE.WINDOW_ONLINE',
                        'WS_CONN_EVENT',
                      );
                    }
                  }),
                  mapTo(true),
                ),
              )
                // ..take the first one..
                .pipe(first())
                // and re-create the websocket.
                // FIXME
                // eslint-disable-next-line rxjs/no-nested-subscribe
                .subscribe(() => {
                  this.ngZone.runOutsideAngular(() => {
                    if (
                      this.shouldTrackWebsocketDisconnectionEvent(
                        this.connectRetryCount,
                      )
                    ) {
                      this.tracking.trackCustomEvent(
                        'WS.ONCLOSE.RECONNECTING',
                        'WS_CONN_EVENT',
                      );
                    }
                    this.create(true);
                  });
                });
            }
          });
        };
      });

      return () => {
        if (this.sock) {
          closed();
          this.ngZone.runOutsideAngular(() => {
            this.sock.close();
          });
        }
      };
    });
  }

  processEvent(event: WebsocketServerEvent, userId: string) {
    // Process websocket message
    if (isWebsocketMessage(event)) {
      this.processMessage(event, userId);
    }
    // Resubscribe to resource if receiving expiration notice
    if (isWebsocketSubscriptionExpiring(event)) {
      this.resourceResubscribe(event);
    }
  }

  sendEvent(message: SockMessageSend) {
    if (this.open) {
      this.ngZone.runOutsideAngular(() => {
        this.sock.send(message);
      });
    } else {
      console.error('Tried sending a message to a closed websocket.');
      this.tracking.trackCustomEvent(
        'WS.SEND_MSG_CLOSED_CONN',
        'WS_CONN_EVENT',
      );
    }
  }

  private resourceResubscribe(event: ExpiringSubscription) {
    this.sendEvent(generateResourcesSubMessage(event.body.resources));
  }

  private processMessage(event: WebsocketMessage, toUserId: string) {
    const { body }: { body: WebsocketEvent } = event;

    const action: TypedAction = {
      type: 'WS_MESSAGE',
      no_persist: event.body.no_persist,
      payload: {
        ...body,
        toUserId, // all WebSocket messages are tied to the current user
      },
    };
    this.store$.dispatch(action);
    // Once the store is updated then we can let everyone know.
    this.fromServerStream$.next(event);
  }

  /* We buffer the user subscriptions and unsubscriptions by 1 second
   * to reduce backend load.
   * It's possible to have subscribed and unsubscriped within that buffer
   * so we remove such sub/unsub (and reverse) manually.
   */
  private subscribeToEvents() {
    // Subscribe to existing subscriptions
    const existingSubscriptions = this.onlineOfflineSubscriptions.values();
    if (existingSubscriptions.length) {
      this.sendEvent(generateOnlineOfflineSub(existingSubscriptions));
    }

    if (this.channelSubscriptions.size) {
      this.sendEvent(
        generateChannelSubMessage(Array.from(this.channelSubscriptions)),
      );
    }

    const existingResourcesSubscriptions = this.resourcesSubscriptions.values();
    if (existingResourcesSubscriptions.length) {
      this.sendEvent(
        generateResourcesSubMessage(existingResourcesSubscriptions),
      );
    }

    this.sendEvent(
      generateOnlineOfflineSub(this.onlineOfflineSubscriptions.values()),
    );
  }

  /**
   * Subscribes and unsubscribes to a list of resources by id.
   *
   * This is designed such that it is passed an observable of `ids$` and returns
   * a observable to be subscribed to such that:
   *  - when the return result is subscribed this will subscribe on the
   *    websocket to the resources in `ids$`
   *  - when the `ids$` change this will subscribe to new ids and unsubscribe
   *    from old ids as required
   *  - when the return result is unsubscribed it will unsubscribe on the
   *    websocket to all of `ids$`
   */
  subscribeToIds(
    collectionName: string,
    ids$: Rx.Observable<ReadonlyArray<string>>,
  ): Rx.Observable<unknown> {
    switch (collectionName) {
      case 'onlineOffline':
        return this.subscribeOnlineOffline(ids$);

      case 'groups':
        return this.subscribeToResources(
          ids$.pipe(
            map(ids =>
              ids.map(id => ({
                id: toNumber(id),
                type: ResourceTypeApi.GROUP,
              })),
            ),
          ),
        );

      default:
        throw new Error(`Cannot subscribe to collection '${collectionName}'`);
    }
  }

  private subscribeOnlineOffline(
    userIds$: Rx.Observable<ReadonlyArray<string>>,
  ) {
    // Watch the user id stream, calculate watch for changes,
    // subscribe/unsubscribe to any additions/removals respectively
    // and return the user status for the user who is subscribed to.
    // We add `undefined` to the end so we can get the last unsub.
    const incomingUserIds$ = Rx.concat(
      userIds$.pipe(
        distinctUntilChanged(),
        map(ids => ids.map(id => toNumber(id))),
        startWithEmptyList(),
      ),
      Rx.of([]),
    ).pipe(pairwise());

    // Work out which user ids are just added to this subscription.
    const addedUserIds$ = incomingUserIds$.pipe(
      map(([previous, current]) => setDiff(current, previous)),
    );

    // Work out which user ids are just removed to this subscription.
    const removedUserIds$ = incomingUserIds$.pipe(
      map(([previous, current]) => setDiff(previous, current)),
    );

    // Add new ids to subscription counts and return ones newly added to the global collection
    const newlyAddedUserIds$ = addedUserIds$.pipe(
      map(ids =>
        ids.filter(id => {
          this.onlineOfflineSubscriptions.add(id);
          return this.onlineOfflineSubscriptions.multiplicity(id) === 1;
        }),
      ),
    );

    // Add new ids to subscription counts and return ones newly added to the global collection
    const newlyRemovedUserIds$ = removedUserIds$.pipe(
      map(ids =>
        ids.filter(id => {
          if (this.onlineOfflineSubscriptions.multiplicity(id) === 0) {
            console.warn(`Tried removing user ${id} who is already removed.`);
          }
          this.onlineOfflineSubscriptions.remove(id);
          return this.onlineOfflineSubscriptions.multiplicity(id) === 0;
        }),
      ),
    );

    // Send websocket events and return an Rx.Observable.never()
    return Rx.NEVER.pipe(
      withLatestFrom(
        newlyAddedUserIds$.pipe(
          tap(ids => {
            if (this.open && ids.length) {
              this.sendEvent(generateOnlineOfflineSub(ids));
            }
          }),
        ),
        newlyRemovedUserIds$.pipe(
          tap(ids => {
            if (this.open && ids.length) {
              this.sendEvent(generateOnlineOfflineUnsub(ids));
            }
          }),
        ),
      ),
    );
  }

  /**
   * Subscribe to resources based on their ids.
   * To be used ONLY in this service as a automatic collection subscription mechanism.
   */
  private subscribeToResources(
    resources$: Rx.Observable<ReadonlyArray<WebsocketResource>>,
  ) {
    const incomingResources$ = resources$.pipe(startWith([]), pairwise());

    // Work out which resources are just added to this subscription.
    const addedResources$ = incomingResources$.pipe(
      map(([previous, current]) => setDiff(current, previous)),
    );

    // Work out which resources are just removed to this subscription.
    const removedResources$ = incomingResources$.pipe(
      map(([previous, current]) => setDiff(previous, current)),
    );

    // Add new resources to subscriptions and return ones newly added
    const newlyAddedResources$ = addedResources$.pipe(
      map(resources =>
        resources.filter(resource => {
          this.resourcesSubscriptions.add(resource);
          return this.resourcesSubscriptions.multiplicity(resource) === 1;
        }),
      ),
    );

    // Remove resources from subscription and return ones newly removed
    const newlyRemovedResources$ = removedResources$.pipe(
      map(resources =>
        resources.filter(resource => {
          this.resourcesSubscriptions.remove(resource);
          return this.resourcesSubscriptions.multiplicity(resource) === 0;
        }),
      ),
    );

    // Send websocket events and return an Rx.Observable.never()
    return Rx.NEVER.pipe(
      withLatestFrom(
        newlyAddedResources$.pipe(
          tap(resources => {
            if (this.open && resources.length) {
              this.sendEvent(generateResourcesSubMessage(resources));
            }
          }),
        ),
        newlyRemovedResources$.pipe(
          tap(resources => {
            if (this.open && resources.length) {
              this.sendEvent(generateResourcesUnsubMessage(resources));
            }
          }),
        ),
      ),
    );
  }

  /**
   * This overrides the list of custom channels that the websocket will be listening to.
   */
  setChannels(channels: ReadonlyArray<WebsocketChannel>) {
    const currentSubscriptions = Array.from(this.channelSubscriptions);
    const arrayDiff = (
      a: ReadonlyArray<WebsocketChannel>,
      b: ReadonlyArray<WebsocketChannel>,
    ) => a.filter(x => !b.includes(x));

    this.unsubscribeChannels(arrayDiff(currentSubscriptions, channels));
    this.subscribeChannels(arrayDiff(channels, currentSubscriptions));
  }

  private subscribeChannels(channels: ReadonlyArray<WebsocketChannel>) {
    if (channels.length) {
      if (this.open) {
        this.sendEvent(generateChannelSubMessage(channels));
      }
      channels.forEach(channel => this.channelSubscriptions.add(channel));
    }
  }

  private unsubscribeChannels(channels: ReadonlyArray<WebsocketChannel>) {
    if (channels.length) {
      channels.forEach(channel => this.channelSubscriptions.delete(channel));

      /* TODO: Do this properly.
       * Unfortunately the websocket backend doesn't support unsubscribing
       * and so we need to disconnect and reconnect the websocket to unsub :(
       *
       * Ref T35544
       */
      if (this.unsubDebounceTime) {
        clearTimeout(this.unsubDebounceTime);
      }
      this.unsubDebounceTime = this.timeUtils.setTimeout(() => {
        this.unsubDebounceTime = undefined;
        this.ngZone.runOutsideAngular(() => {
          this.sock.close();
        });
        this.timeUtils.setTimeout(() => this.create(), 1000);

        // We should also disconnect the other websocket that libnotify has.
        const w = window as any;
        if (w.libnotify && w.libnotify.close) {
          w.libnotify.close();
        }
      }, 5000);
    }
  }

  /**
   * When retry count reaches TRACKING_RETRY_COUNT_THRESHOLD, send tracking request only when retry count is a multiple of TRACKING_RETRY_COUNT_DEBOUNCE.
   *
   * @param retryCount
   */
  private shouldTrackWebsocketDisconnectionEvent(retryCount: number): boolean {
    return (
      retryCount < this.TRACKING_RETRY_COUNT_THRESHOLD ||
      retryCount % this.TRACKING_RETRY_COUNT_DEBOUNCE === 0
    );
  }
}
