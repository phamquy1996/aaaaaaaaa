import { MapsAPILoader } from '@agm/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { enterZone } from '@freelancer/time-utils';
import {} from 'googlemaps';
import * as Rx from 'rxjs';
import { observeOn, publish, refCount } from 'rxjs/operators';

// Subset of methods on google.maps.places.Autocomplete. Add more if needed.
export interface GoogleMapsAutocomplete {
  /* A multicasted observable of the PlaceResult returned by autocomplete */
  placeChanged(): Rx.Observable<google.maps.places.PlaceResult>;
  setComponentRestrictions(
    restrictions: google.maps.places.ComponentRestrictions,
  ): void;
}

export interface GoogleMapsGeocodeResponse {
  results: readonly google.maps.GeocoderResult[];
  status: google.maps.GeocoderStatus;
}

@Injectable({
  providedIn: 'root',
})
/**
 * Wrapper around the Google Maps JavaScript API.
 * Call `load` to bootstrap the Maps API before calling any other methods.
 *
 * @see https://developers.google.com/maps/documentation/javascript/tutorial
 *
 * NOTE: Keep in sync with GoogleMapsTesting
 */
export class GoogleMaps {
  private loaded = false;
  private geocoder: google.maps.Geocoder;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Loads the Google Maps API onto the page.
   * No-op and returns false on the server.
   */
  load(): Promise<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      return this.mapsAPILoader.load().then(() => {
        if (!this.geocoder) {
          this.geocoder = new google.maps.Geocoder();
        }

        this.loaded = true;
        return true;
      });
    }

    return Promise.resolve(false);
  }

  /**
   * Creates an Autocomplete object, which is a text input field that returns
   * place predictions as the user types.
   *
   * Wrapper around `google.maps.places.Autocomplete`.
   *
   * @see https://developers.google.com/maps/documentation/javascript/places-autocomplete
   */
  createAutocomplete(
    inputField: HTMLInputElement,
    options?: google.maps.places.AutocompleteOptions,
  ): GoogleMapsAutocomplete {
    if (this.isNotLoaded()) {
      throw new Error(
        'Maps API is not loaded yet. Call GoogleMaps.load() first.',
      );
    }

    const autocomplete = new google.maps.places.Autocomplete(
      inputField,
      options,
    );
    let placeChangedListener: google.maps.MapsEventListener | undefined;

    const placeChanged$ = new Rx.Observable<google.maps.places.PlaceResult>(
      observer => {
        placeChangedListener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          observer.next(place);
        });

        // teardown logic
        return () => {
          if (placeChangedListener) {
            placeChangedListener.remove();
          }
          observer.unsubscribe();
        };
      },
    ).pipe(
      // Re-enter the Angular zone so clients don't have to call `ngZone.run`.
      // QueueScheduler because we are only using this operator to re-enter, and
      // don't actually want to emit values asynchronously
      observeOn(enterZone(this.ngZone, Rx.queueScheduler)),
      publish(),
      refCount(),
    );

    return {
      placeChanged: () => placeChanged$,
      setComponentRestrictions: (
        restrictions: google.maps.places.ComponentRestrictions,
      ) => {
        autocomplete.setComponentRestrictions(restrictions);
      },
    };
  }

  /**
   * Converts a human-readable address (e.g. "680 George Street, Sydney, NSW")
   * into geographic coordinates (e.g. latitude -33.8771501, longitude 151.2062187)
   *
   * @see https://developers.google.com/maps/documentation/javascript/geocoding
   */
  geocode(
    request: google.maps.GeocoderRequest,
  ): Promise<GoogleMapsGeocodeResponse> {
    if (this.isNotLoaded()) {
      throw new Error(
        'Maps API is not loaded yet. Call GoogleMaps.load() first.',
      );
    }

    return new Promise(resolve => {
      // Run outside Angular's zone because fl-text's read more functionality
      // relies on zone stabilisation. See text.component.ts#ngAfterViewInit.
      // No need to re-enter the zone in the client's `then` callback
      this.ngZone.runOutsideAngular(() => {
        this.geocoder.geocode(request, (results, status) => {
          resolve({ results, status });
        });
      });
    });
  }

  // Maps API can only be loaded on the browser
  private isNotLoaded() {
    return isPlatformBrowser(this.platformId) && !this.loaded;
  }
}
