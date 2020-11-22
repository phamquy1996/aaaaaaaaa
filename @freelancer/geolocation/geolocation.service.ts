import { Injectable, NgZone } from '@angular/core';
import { Pwa } from '@freelancer/pwa';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig as RawBackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse,
} from '@laurentgoudet/ionic-native-background-geolocation/ngx';
import * as Rx from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

export interface GeolocationOptions {
  /**
   * Use that if you do need a high level of precision.
   * Use this sparingly: it's slower to resolve and uses more battery. If you
   * want to find the nearest Freelancers to a user, it's unlikely that you
   * need 1-meter precision.
   */
  enableHighAccuracy?: boolean;
  /**
   * Response maximum age in milleseconds.
   * This not only returns more quickly if the user has requested the data
   * before, but it also prevents the browser from starting its geolocation
   * hardware interfaces such as Wifi triangulation or the GPS.
   */
  maximumAge?: number;
  /**
   * Request timeout in millisecond. We currently set a 10 seconds default.
   */
  timeout?: number;
}

export type GeolocationResponse =
  | GeolocationSuccessResponse
  | GeolocationErrorResponse;

export interface GeolocationSuccessResponse {
  readonly status: 'success';
  readonly position: GeolocationPosition;
}

export interface GeolocationPosition {
  // The GPS coordinates along with the accuracy of the data
  // Most of these are optionals as they depend on the device capabilities
  coords: {
    latitude: number;
    longitude: number;
    // meters above sea level
    altitude?: number;
    // accuracy or radius of accuracy in meters
    accuracy?: number;
    // accuracy or radius of accuracy in meters
    altitudeAccuracy?: number;
    // how many degrees from true North the device is moving
    heading?: number;
    // velocity in meters/second the device is moving
    speed?: number;
  };
  // Creation timestamp for coords
  timestamp: number;
}

export interface GeolocationErrorResponse {
  readonly status: 'error';
  readonly errorCode: GeolocationErrorCode;
}

export type GeolocationErrorCode =
  // User denied the request for Geolocation
  // If you are getting that, you should have a fallback UI explaining to the
  // user when then need to authorize geolocation and how to do it.
  | 'PERMISSION_DENIED'
  // Location information is unavailable, e.g. device has no sensor
  | 'POSITION_UNAVAILABLE'
  // The request to get user location timed out, i.e. position could not be
  // collected within the timeout interval (underground with no wifi nor cell
  // network?)
  | 'TIMEOUT'
  // An unknown error occurred, so much unknown that even the device doesn't
  // know why
  | 'UNKONWN_ERROR';

export interface BackgroundGeolocationConfig {
  readonly notificationTitle: string;
  readonly notificationText: string;
}

export interface BackgroundGeolocationTask {
  readonly status$: Rx.Observable<BackgroundGeolocationStatus>;
  stop(): void;
}

export type BackgroundGeolocationStatus =
  | {
      readonly status: 'running';
    }
  | {
      readonly status: 'stopped';
    }
  | {
      readonly status: 'error';
      readonly errorCode: GeolocationErrorCode;
    };

/*
 * A service wrapping the web platform Geolocation API, and providing
 * background geolocation capabilities in native contexts (i.e. when the app is
 * installed as a native app).
 */
@Injectable({
  providedIn: 'root',
})
export class Geolocation {
  private defaultOptions = {
    // Unless a timeout is set, the geolocation request might never return. We
    // set a 10 seconds default timeout to prevent that.
    timeout: 10 * 1000,
  };

  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private ngZone: NgZone,
    private pwa: Pwa,
  ) {}

  /**
   * Get the user current position
   *
   * /!\ Always request access to location on a user gesture, Never call that
   * from a lifecycle hook at the request access window won't pop up.
   */
  getCurrentPosition(
    options: GeolocationOptions = {},
  ): Promise<GeolocationResponse> {
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
    };
    if (!navigator.geolocation) {
      return Promise.resolve({
        status: 'error',
        errorCode: 'POSITION_UNAVAILABLE',
      });
    }
    if (this.pwa.isNative()) {
      return this.pwa
        .capacitorPlugins()
        .then(({ Geolocation: geolocationPlugin }) =>
          geolocationPlugin.getCurrentPosition(mergedOptions),
        )
        .then(position => ({
          status: 'success' as const,
          position: this.getPositionFromRawPosition(position),
        }))
        .catch(error => ({
          status: 'error',
          errorCode: this.getErrorCodeFromRawError(error),
        }));
    }
    return new Promise(resolve => {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            status: 'success',
            position: this.getPositionFromRawPosition(position),
          });
        },
        error =>
          resolve({
            status: 'error',
            errorCode: this.getErrorCodeFromRawError(error),
          }),
        mergedOptions,
      );
    });
  }

  /**
   * Watch the user location
   *
   * Location tracking will be paused when the app goes into background. Use
   * watchPositionBackground if you want to keep tracking the user position
   * while the app is in background.
   *
   * /!\ Always request access to location on a user gesture, Never call that
   * from a lifecycle hook at the request access window won't pop up.
   */
  watchPosition(
    options: GeolocationOptions = {},
  ): Rx.Observable<GeolocationResponse> {
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
    };
    if (!navigator.geolocation) {
      return Rx.of({
        status: 'error',
        errorCode: 'POSITION_UNAVAILABLE',
      });
    }
    if (this.pwa.isNative()) {
      return new Rx.Observable((observer: Rx.Observer<GeolocationResponse>) => {
        let clearWatch = () => {
          // noop
        };
        this.pwa
          .capacitorPlugins()
          .then(({ Geolocation: geolocationPlugin }) => {
            const watchId = geolocationPlugin.watchPosition(
              mergedOptions,
              (position, error) => {
                this.ngZone.run(() => {
                  if (error) {
                    observer.next({
                      status: 'error',
                      errorCode: this.getErrorCodeFromRawError(error),
                    });
                  } else {
                    observer.next({
                      status: 'success',
                      position: this.getPositionFromRawPosition(position),
                    });
                  }
                });
              },
            );
            clearWatch = () => {
              geolocationPlugin.clearWatch({ id: watchId });
            };
          });
        return () => clearWatch();
      }).pipe(publishReplay(1), refCount());
    }
    return new Rx.Observable((observer: Rx.Observer<GeolocationResponse>) => {
      const watchId = window.navigator.geolocation.watchPosition(
        position => {
          observer.next({
            status: 'success',
            position: this.getPositionFromRawPosition(position),
          });
        },
        error => {
          observer.next({
            status: 'error',
            errorCode: this.getErrorCodeFromRawError(error),
          });
        },
        mergedOptions,
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }).pipe(publishReplay(1), refCount());
  }

  /**
   * Checks if background geolocation is available
   */
  canWatchPositionBackground(): boolean {
    return this.pwa.isNative();
  }

  /**
   * Watch the user location while the app is in background
   *
   * /!\  Only currently supported through Capacitor, i.e. the app must be
   * installed. Call BackgroundGeolocation::canWatchPositionBackground() must
   * to ensure this is background geotracking is supported on the device.
   */
  watchPositionBackground(
    callback: (p: GeolocationPosition) => Promise<any>,
    config: BackgroundGeolocationConfig,
  ): BackgroundGeolocationTask {
    if (!this.canWatchPositionBackground()) {
      return {
        status$: Rx.of({
          status: 'error',
          errorCode: 'POSITION_UNAVAILABLE',
        }),
        stop: () => {
          // noop
        },
      };
    }
    const mergedConfig: RawBackgroundGeolocationConfig = {
      ...{
        desiredAccuracy: 10,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle: config.notificationTitle,
        notificationText: config.notificationText,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        startForeground: true,
      },
      ...config,
    };
    const statusSubject$ = new Rx.ReplaySubject<BackgroundGeolocationStatus>();

    this.backgroundGeolocation.configure(mergedConfig).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe(async (rawLocation: BackgroundGeolocationResponse) => {
          /*
           * provider: "gps"
           * locationProvider: 0
           * time: 1586176100350
           * latitude: 44.82024509006005
           * longitude: -0.5782134212294999
           * accuracy: 24
           * speed: 0.12992942333221436
           * altitude: 39.42696268889978
           * bearing: 112.3025131225586
           * isFromMockProvider: false
           * mockLocationsEnabled: false
           * id: 3
           */
          await this.ngZone.run(() =>
            callback(
              this.getPositionFromRawPosition({
                coords: {
                  latitude: rawLocation.latitude,
                  longitude: rawLocation.longitude,
                  altitude: rawLocation.altitude,
                  accuracy: rawLocation.accuracy,
                  altitudeAccuracy: null,
                  // TODO: compute heading from bearing?
                  heading: null,
                  speed: rawLocation.speed,
                },
                timestamp: rawLocation.time,
              }),
            ),
          );
          // This must be executed to inform the native plugin that the
          // background task may be completed or iOS will crash it for spending
          // too much time in the background
          this.backgroundGeolocation.finish();
        });

      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.error)
        .subscribe(error => {
          console.log(error);
          // TODO: add proper error codes here
          statusSubject$.next({
            status: 'error',
            errorCode: 'UNKONWN_ERROR',
          });
          console.error(error);
        });
    });

    // Start recording location
    this.backgroundGeolocation.start();
    statusSubject$.next({
      status: 'running',
    });

    return {
      status$: statusSubject$.asObservable(),
      stop: () => {
        this.backgroundGeolocation.stop();
        statusSubject$.next({
          status: 'stopped',
        });
      },
    };
  }

  // This converts the raw error object into error codes, allowing ensuring
  // that people can't use the (untranslated & not user friendly) default
  // platform error strings in their error handling UIs.
  private getErrorCodeFromRawError(error: PositionError): GeolocationErrorCode {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'PERMISSION_DENIED';
      case error.POSITION_UNAVAILABLE:
        return 'POSITION_UNAVAILABLE';
      case error.TIMEOUT:
        return 'TIMEOUT';
      default:
        return 'UNKONWN_ERROR';
    }
  }

  // This converts null values into undefined as we ban the use of null
  // throughout the webapp.
  private getPositionFromRawPosition(p: {
    coords: Partial<Position['coords']>;
    timestamp: number;
  }): GeolocationPosition {
    if (
      !p.coords ||
      !p.coords.latitude ||
      !p.coords.longitude ||
      !p.timestamp
    ) {
      throw new Error(`Invalid position object ${JSON.stringify(p)}`);
    }
    return {
      coords: {
        latitude: p.coords.latitude,
        longitude: p.coords.longitude,
        altitude: p.coords.altitude ?? undefined,
        accuracy: p.coords.accuracy ?? undefined,
        altitudeAccuracy: p.coords.altitudeAccuracy ?? undefined,
        heading: p.coords.heading ?? undefined,
        speed: p.coords.speed ?? undefined,
      },
      timestamp: p.timestamp,
    };
  }
}
