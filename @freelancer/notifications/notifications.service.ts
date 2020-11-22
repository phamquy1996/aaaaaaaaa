import { isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  ErrorHandler,
  Inject,
  Injectable,
  PLATFORM_ID,
} from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SwPush } from '@angular/service-worker';
import { PermissionType } from '@capacitor/core';
import { Auth } from '@freelancer/auth';
import { FreelancerHttp } from '@freelancer/freelancer-http';
import { LocalStorage } from '@freelancer/local-storage';
import { Location } from '@freelancer/location';
import { Pwa } from '@freelancer/pwa';
import { toNumber } from '@freelancer/utils';
import * as Rx from 'rxjs';
import { first, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import * as uuidv4 from 'uuid/v4';

export type NotificationPermission = 'granted' | 'denied' | 'default';

export type NotificationRegisterResult =
  | {
      readonly status: 'success';
    }
  | {
      readonly status: 'error';
      readonly errorCode: NotificationPermissionErrorCode;
    };

export enum NotificationPermissionErrorCode {
  //  Permission has been denied by the user
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

@Injectable({ providedIn: 'root' })
export class Notifications {
  tokenChanges$: Rx.Observable<string | undefined>;

  foregroundMessagesSubscription?: Rx.Subscription;
  notificationClicksSubscription?: Rx.Subscription;
  tokenChangesSubscription?: Rx.Subscription;

  constructor(
    private afMessaging: AngularFireMessaging,
    private auth: Auth,
    private appRef: ApplicationRef,
    private errorHandler: ErrorHandler,
    private freelancerHttp: FreelancerHttp,
    private localStorage: LocalStorage,
    private location: Location,
    private push: SwPush,
    private pwa: Pwa,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Can permission to show notifications be requested. This implies that
   * permission has not been already granded.
   *
   * Used that to display a user prompt to enable notifications
   */
  async canRequestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    const permission = await this.getPermission();
    return permission === 'default';
  }

  /**
   * Has permission to show notifications already been granted
   *
   * Used to automatically register push notifications on login
   */
  async hasGrantedPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    const permission = await this.getPermission();
    return permission === 'granted';
  }

  /**
   * Are notifications supported by the platform.
   *
   * If this is true but both canRequestPermission() are hasGrantedPermission()
   * are false, this implies the user has previously denied permission: use
   * that a display a user prompt to try to recover the user.
   */
  isSupported(): boolean {
    // Disable on the server
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Notifications are always supported on native
    if (this.pwa.isNative()) {
      return true;
    }

    // In the browser, both Service Workers & the Push API need to be supported
    // Technically we don't use the Angular Service Worker but using
    // `SwPush::isEnabled` here allows to share the SW enabling logic.
    return (
      this.push.isEnabled && 'PushManager' in window && 'Notification' in window
    );
  }

  /**
   * Register the application to receive push notifications. Will request
   * permission to the user if needed, i.e. do not call that on load unless
   * permission has already been granted.
   */
  async registerPushNotifications(): Promise<NotificationRegisterResult> {
    if (!this.isSupported()) {
      throw new Error(
        'Push notifications are not supported on the current platform: make sure to check isSupported() before calling registerPushNotifications()',
      );
    }

    if (!this.auth.isLoggedIn()) {
      throw new Error('User must be logged-in to register push notifications');
    }

    if (!this.hasGrantedPermission() && !this.canRequestPermission()) {
      return {
        status: 'error',
        errorCode: NotificationPermissionErrorCode.PERMISSION_DENIED,
      };
    }

    // Do nothing if already registered
    if (this.tokenChangesSubscription) {
      return {
        status: 'success',
      };
    }

    let foregroundMessages$: Rx.Observable<object>;
    let notificationClicks$: Rx.Observable<{
      action?: string;
      notification: {
        title?: string;
        subtitle?: string;
        body?: string;
        badge?: string;
        data?: {
          url?: string;
        };
      };
    }>;
    if (this.pwa.isNative()) {
      const { PushNotifications } = await this.pwa.capacitorPlugins();

      // We need to use a replay subject here to cache the registration result until tokenChanges$ is subcribed to
      const registrationSubject$ = new Rx.ReplaySubject<string | undefined>();
      PushNotifications.addListener('registration', t =>
        registrationSubject$.next(t.value),
      );
      PushNotifications.addListener('registrationError', t =>
        registrationSubject$.error(t),
      );

      this.tokenChanges$ = Rx.from(
        PushNotifications.requestPermission().then(res => {
          if (res.granted) {
            return PushNotifications.register();
          }
          registrationSubject$.error(
            new Error('Permission denied by the user'),
          );
        }),
      ).pipe(switchMap(() => registrationSubject$.asObservable()));

      foregroundMessages$ = new Rx.Observable(observer => {
        const listener = PushNotifications.addListener(
          'pushNotificationReceived',
          notification => observer.next(notification),
        );
        return () => listener.remove();
      });

      notificationClicks$ = new Rx.Observable(observer => {
        const listener = PushNotifications.addListener(
          'pushNotificationActionPerformed',
          message =>
            observer.next({
              action: message.actionId,
              notification: {
                ...message.notification,
                badge: message.notification.badge?.toString(),
                title: message.notification.title,
              },
            }),
        );
        return () => listener.remove();
      });
    } else {
      this.tokenChanges$ = this.afMessaging.requestToken.pipe(
        map(token => token ?? undefined),
      );

      foregroundMessages$ = this.afMessaging.messages;

      notificationClicks$ = new Rx.Observable(observer => {
        const handler = (event: any) => {
          const internalPayload = event.data;

          if (!internalPayload.firebaseMessaging) {
            return;
          }

          if (
            internalPayload.firebaseMessaging.type === 'notification-clicked' &&
            internalPayload.firebaseMessaging.payload
          ) {
            observer.next({
              // TODO: implement custom actions when needed
              notification: {
                ...internalPayload.firebaseMessaging.payload.notification,
                data: internalPayload.firebaseMessaging.payload.data,
              },
            });
          }
        };
        navigator.serviceWorker.addEventListener('message', handler);
        return () => {
          navigator.serviceWorker.removeEventListener('message', handler);
        };
      });
    }

    const result = await this.tokenChanges$
      .pipe(take(1))
      .toPromise()
      .then(() => ({
        status: 'success' as const,
      }))
      .catch(() => ({
        status: 'error' as const,
        errorCode: NotificationPermissionErrorCode.PERMISSION_DENIED,
      }));

    // Permission has been granted by the user
    if (result.status === 'success') {
      const deviceId = await this.getDeviceId();

      this.tokenChangesSubscription = this.tokenChanges$
        .pipe(
          tap(token => console.log('Device token:', token)),
          switchMap(token =>
            this.auth.getUserId().pipe(
              take(1),
              switchMap(userId =>
                // The token is automatically updated based on the unique device ID
                this.freelancerHttp.post('users/0.1/tokens', {
                  kind: 'fcm',
                  app_type: 'freelancer',
                  data: token,
                  device_id: deviceId,
                  user_id: toNumber(userId),
                }),
              ),
            ),
          ),
        )
        .subscribe({
          error: err => {
            this.errorHandler.handleError(err);
          },
        });

      this.foregroundMessagesSubscription = foregroundMessages$.subscribe(
        notification => {
          // This is called when notifications are received while the app is in
          // foreground, as these won't be shown as notifications.
          // Presumably we don't need to do anything here as the same
          // notifications will be received through the WebSocket, which will be
          // used to update the UI/show a toast notification.
          console.log('New foreground message: ', notification);
        },
      );

      this.notificationClicksSubscription = notificationClicks$.subscribe(
        async ({ action, notification }) => {
          // This is called when the user performs an action on a notification
          console.log('Notification click: ', action, notification);
          // If the url data field is set, navigate to the destination
          const url = notification?.data?.url;
          if (url) {
            await this.appRef.isStable
              .pipe(first(isStable => isStable))
              .toPromise();
            await this.location.navigateByUrl(url);
          }
        },
      );
    }

    return result;
  }

  /**
   * Unregister the application to receive push notifications.
   */
  unregisterPushNotifications(): Promise<void> {
    // Reset subscriptions
    if (this.foregroundMessagesSubscription) {
      this.foregroundMessagesSubscription.unsubscribe();
      this.foregroundMessagesSubscription = undefined;
    }
    if (this.notificationClicksSubscription) {
      this.notificationClicksSubscription.unsubscribe();
      this.notificationClicksSubscription = undefined;
    }
    if (this.tokenChangesSubscription) {
      this.tokenChangesSubscription.unsubscribe();
      this.tokenChangesSubscription = undefined;
    }

    // Silently return if notifications haven't been setup
    if (!this.tokenChanges$) {
      return Promise.resolve();
    }

    return this.tokenChanges$
      .pipe(
        switchMap(token => {
          if (token) {
            return Rx.combineLatest([
              this.freelancerHttp.delete('users/0.1/tokens', {
                params: {
                  kind: 'fcm',
                  app_type: 'freelancer',
                  data: token,
                },
              }),
              this.afMessaging.deleteToken(token),
            ]);
          }
          return Rx.EMPTY;
        }),
        take(1),
        mapTo(undefined),
      )
      .toPromise();
  }

  /**
   * @deprecated
   * Manually trigger a notification
   */
  showNotification() {
    // We explicitly DO NOT want to implement that, i.e. create & show
    // Notifications from the webapp itself: all notifications should be
    // transformed/filtered/sent from the backend and are automatically handled
    // in the Service Worker/native background tasks in order to ensure
    // consistency & provide background notifications support accross platforms
    throw Error('Not implemented on purpose');
  }

  private async getPermission(): Promise<NotificationPermission> {
    if (this.pwa.isNative()) {
      const { Permissions } = await this.pwa.capacitorPlugins();
      const result = await Permissions.query({
        name: PermissionType.Notifications,
      });
      if (result.state === 'prompt') {
        return 'default';
      }
      return result.state as NotificationPermission;
    }
    return Notification.permission;
  }

  private async getDeviceId(): Promise<string> {
    const deviceId = this.localStorage
      .get('deviceId')
      .pipe(take(1))
      .toPromise();
    if (typeof deviceId === 'string' && deviceId) {
      return deviceId;
    }
    const id = uuidv4();
    this.localStorage.set('deviceId', id);
    return id;
  }
}
