import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Country,
  Location,
  _usersLocationTransformCountry,
} from '@freelancer/datastore/collections';
import { GoogleMaps, GoogleMapsAutocomplete } from '@freelancer/google-maps';
import { InputComponent, InputSize } from '@freelancer/ui/input';
import { Margin } from '@freelancer/ui/margin';
import { FontColor, TextSize } from '@freelancer/ui/text';
import * as Rx from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { IconColor, IconSize } from '../icon';
import { MapCoordinates } from '../map';
import { dirtyAndValidate } from '../validators';

/**
 * The `type` passed to the GMaps API when doing autocompletion.
 * See https://developers.google.com/places/web-service/autocomplete#place_types
 */
export enum AutocompleteLocationType {
  GEOCODING = 'geocode',
  ADDRESS = 'address',
  REGIONS = '(regions)',
  ALL = 'all',
}

/**
 * The `type` returned by the GMaps API when doing a location search.
 * See https://developers.google.com/places/web-service/supported_types
 */
export enum GoogleMapsLocationTypes {
  ADDRESS = 'address',
  COUNTRY = 'country',
}

enum LocationError {
  AUTOCOMPLETE_FAILED,
  DETECT_LOCATION_FAILED,
  DETECT_LOCATION_PERMISSION_DENIED,
  DETECT_LOCATION_UNSUPPORTED,
  SELECT_FROM_DROPDOWN,
}

interface GoogleMapsLocation {
  // coordinates are from Geolocation.getCurrentPosition()
  readonly latitude: number;
  readonly longitude: number;
  // coordinates are from google.maps.Geocoder.geocode()
  readonly location: Location;
  readonly type: GoogleMapsLocationTypes;
}

@Component({
  selector: 'fl-location-input',
  template: `
    <fl-bit class="InputSection">
      <fl-input
        #input
        class="LocationInput"
        [control]="nativeControl"
        [disabled]="disabled || control.disabled"
        [iconEnd]="getIconEnd()"
        [rightIconColor]="
          showRemoveLocationButton() ? IconColor.MID : IconColor.INHERIT
        "
        [rightIconSize]="
          showRemoveLocationButton() ? IconSize.SMALL : IconSize.MID
        "
        [size]="inputSize"
        (iconEndClick)="handleIconClick()"
      ></fl-input>
    </fl-bit>
    <fl-text
      [ngSwitch]="error"
      [color]="FontColor.ERROR"
      [size]="TextSize.XXSMALL"
    >
      <ng-container
        *ngSwitchCase="LocationError.AUTOCOMPLETE_FAILED"
        i18n="Location input error message"
      >
        Could not fetch location data from Google. Please try selecting your
        location again.
      </ng-container>
      <ng-container
        *ngSwitchCase="LocationError.DETECT_LOCATION_FAILED"
        i18n="Location input error message"
      >
        Could not detect your location. Please refresh the page and try again.
      </ng-container>
      <ng-container
        *ngSwitchCase="LocationError.DETECT_LOCATION_PERMISSION_DENIED"
        i18n="Location input error message"
      >
        Could not detect your location. Please check your location sharing
        permissions and try again.
      </ng-container>
      <ng-container
        *ngSwitchCase="LocationError.DETECT_LOCATION_UNSUPPORTED"
        i18n="Location input error message"
      >
        Your browser does not support location sharing. Please manually enter
        your location or try a different browser.
      </ng-container>
      <ng-container
        *ngSwitchCase="LocationError.SELECT_FROM_DROPDOWN"
        i18n="Location input error message"
      >
        Please select a location from the dropdown
      </ng-container>
    </fl-text>
  `,
  styleUrls: ['./location-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationInputComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  IconSize = IconSize;
  IconColor = IconColor;
  FontColor = FontColor;
  TextSize = TextSize;
  LocationError = LocationError;
  Margin = Margin;

  @Input() control: FormControl;
  /** Whether or not to display the detect location button  */
  @Input() detectLocation = false;
  @Input() inputSize = InputSize.MID;
  @Input() disabled = false;
  /**
   * The `type` passed to the GMaps API when doing autocompletion.
   * See https://developers.google.com/places/web-service/autocomplete#place_types
   */
  @Input() locationType = AutocompleteLocationType.ALL;
  /** Limits the results to the countries if given.  */
  @Input() countryRestrictions?: ReadonlyArray<Country>;
  /** Include postal code, if present, in the location full address */
  @Input() displayPostalCode = false;

  @Output() clearLocation = new EventEmitter();

  @ViewChild('input') input: InputComponent;

  autocomplete: GoogleMapsAutocomplete;
  nativeControl = new FormControl('');

  /**
   * TODO: Refactor component's error state.
   * Use `nativeControl` to handle all validation.
   * TICKET: T104219
   */
  error?: LocationError;

  valueResetSubscription?: Rx.Subscription;
  statusChangeSubscription?: Rx.Subscription;
  placeChangedSubscription?: Rx.Subscription;

  constructor(private cd: ChangeDetectorRef, private googleMaps: GoogleMaps) {}

  ngOnInit() {
    if (this.control && this.control.validator) {
      this.nativeControl.setValidators(this.control.validator);
      this.nativeControl.updateValueAndValidity();
    }

    this.valueResetSubscription = this.nativeControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.error = LocationError.SELECT_FROM_DROPDOWN;
          this.nativeControl.setErrors({ invalid: '' });
        } else {
          this.error = undefined;
        }
        this.control.setValue(undefined);
      });
    this.statusChangeSubscription = this.control.statusChanges
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        this.nativeControl.setValidators(this.control.validator);
        dirtyAndValidate(this.nativeControl);
        this.cd.markForCheck();
      });
  }

  ngAfterViewInit() {
    const locationType =
      this.locationType === AutocompleteLocationType.ALL
        ? undefined
        : { types: [this.locationType] };

    const countryRestrictions = this.countryRestrictions
      ? {
          componentRestrictions: {
            country: this.countryRestrictions
              .filter(c => c)
              .map(country => country.code),
          },
        }
      : undefined;

    this.googleMaps.load().then(loaded => {
      if (loaded) {
        // set default value if it exists
        if (this.control.value) {
          if (this.control.value.fullAddress) {
            this.setFullAddress(this.control.value.fullAddress);
          } else {
            this.setLocationCoordinates(this.control.value);
          }
        }

        // WARNING: don't put anything in the `fields` option that isn't "Basic Data"
        // https://developers.google.com/maps/billing/gmp-billing#data-skus
        // or it could incur significant extra costs to our google maps usage
        this.autocomplete = this.googleMaps.createAutocomplete(
          this.input.nativeElement.nativeElement,
          {
            fields: [
              'address_components',
              'formatted_address',
              'geometry.location',
              'types',
              'vicinity',
            ],
            ...locationType,
            ...countryRestrictions,
          },
        );

        this.placeChangedSubscription = this.autocomplete
          .placeChanged()
          .subscribe(place => {
            if (!place.geometry) {
              this.error = LocationError.AUTOCOMPLETE_FAILED;
              this.nativeControl.setErrors({ invalid: '' });
              return;
            }

            // Use what the autocomplete gives us instead of what the Places API returns so we save exactly what users selected
            let fullAddress = this.input.nativeElement.nativeElement.value;
            let postalCode;

            if (this.displayPostalCode) {
              postalCode = this.getAddressComponentLongName(
                place.address_components,
                'postal_code',
              );

              if (postalCode && !fullAddress.includes(postalCode)) {
                fullAddress += `, ${postalCode}`;
              }
            }

            this.setLocationControl({
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              location: {
                ...this.transformResultToLocation(place),
                fullAddress,
                postalCode,
              },
              type: place.types.includes('country')
                ? GoogleMapsLocationTypes.COUNTRY
                : GoogleMapsLocationTypes.ADDRESS,
            });

            this.cd.markForCheck();
            this.error = undefined;
            this.nativeControl.setErrors(null);
          });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      'countryRestrictions' in changes &&
      this.countryRestrictions &&
      this.autocomplete
    ) {
      this.autocomplete.setComponentRestrictions({
        country:
          this.countryRestrictions.map(country => country.code) || undefined,
      });
    }
  }

  ngOnDestroy() {
    if (this.valueResetSubscription) {
      this.valueResetSubscription.unsubscribe();
    }
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    if (this.placeChangedSubscription) {
      this.placeChangedSubscription.unsubscribe();
    }
  }

  /** Extracts common location information for both Geocoder or Place results  */
  transformResultToLocation(
    place: google.maps.places.PlaceResult | google.maps.GeocoderResult,
  ): Location {
    const addressComponents = place.address_components;
    const countryName = this.getAddressComponentLongName(
      addressComponents,
      'country',
    );
    const countryCode = this.getAddressComponentShortName(
      addressComponents,
      'country',
    );
    const administrativeArea = this.getAddressComponentLongName(
      addressComponents,
      'administrative_area_level_1',
    );

    // Taken from js/local-jobs/geocoding.js
    const vicinity =
      ('vicinity' in place && place.vicinity) ||
      this.getAddressComponentLongName(addressComponents, 'locality') ||
      administrativeArea ||
      countryName ||
      '';

    return {
      administrativeArea,
      fullAddress: place.formatted_address,
      mapCoordinates: {
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      },
      vicinity,
      ...(countryName
        ? {
            country: _usersLocationTransformCountry({
              code: countryCode,
              name: countryName,
            }),
          }
        : {}),
    };
  }

  getAddressComponentLongName(
    addressComponents: google.maps.GeocoderAddressComponent[],
    type: string,
  ): string | undefined {
    const component = addressComponents.find(comp => comp.types.includes(type));
    return component ? component.long_name : undefined;
  }

  getAddressComponentShortName(
    addressComponents: google.maps.GeocoderAddressComponent[],
    type: string,
  ): string | undefined {
    const component = addressComponents.find(comp => comp.types.includes(type));
    return component ? component.short_name : undefined;
  }

  /** Sets the native control's value to the fullAddress if provided */
  setFullAddress(fullAddress: string) {
    this.nativeControl.setValue(fullAddress, {
      emitEvent: false,
    });
    this.error = undefined;
    this.nativeControl.setErrors(null);
  }

  /**
   * Sets the native control's value to the `formatted_address` of the
   * first geocode result from specified coordinates,
   * and updates the input control's value
   * with the transformed geocode result having complete
   * and proper location information
   */
  setLocationCoordinates(coordinates: MapCoordinates) {
    const location = new google.maps.LatLng(
      coordinates.latitude,
      coordinates.longitude,
    );
    this.googleMaps.geocode({ location }).then(({ results, status }) => {
      // No need to re-enter the Angular zone here, because only the Maps
      // API call runs outside it
      if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
        const locationResult = results[0];

        this.nativeControl.setValue(locationResult.formatted_address);

        this.setLocationControl({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          location: this.transformResultToLocation(locationResult),
          type: locationResult.types.includes('country')
            ? GoogleMapsLocationTypes.COUNTRY
            : GoogleMapsLocationTypes.ADDRESS,
        });

        this.error = undefined;
        this.nativeControl.setErrors(null);
      } else {
        this.control.setValue(undefined);
        this.error = LocationError.DETECT_LOCATION_FAILED;
        this.nativeControl.setErrors({ invalid: '' });
      }
    });
  }

  setLocationControl(location: GoogleMapsLocation) {
    this.control.setValue(location);

    if (this.displayPostalCode && location.location.fullAddress) {
      this.nativeControl.setValue(location.location.fullAddress, {
        emitEvent: false,
      });
    }
  }

  handleLocationDetect() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setLocationCoordinates(position.coords);
        },
        (error: PositionError) => {
          this.error =
            error.code === error.PERMISSION_DENIED
              ? LocationError.DETECT_LOCATION_PERMISSION_DENIED
              : LocationError.DETECT_LOCATION_FAILED;
          this.nativeControl.setErrors({ invalid: '' });
          this.nativeControl.markAsTouched();
        },
      );
    } else {
      this.error = LocationError.DETECT_LOCATION_UNSUPPORTED;
      this.nativeControl.setErrors({ invalid: '' });
    }
  }

  handleLocationRemove() {
    this.nativeControl.reset();
    this.control.reset();
    this.clearLocation.emit();
  }

  handleIconClick() {
    if (this.showRemoveLocationButton()) {
      this.handleLocationRemove();
    } else {
      this.handleLocationDetect();
    }
  }

  showRemoveLocationButton(): boolean {
    return this.control.value || this.nativeControl.value;
  }

  getIconEnd(): string | null {
    if (this.showRemoveLocationButton()) {
      return 'ui-close-alt';
    }

    if (this.detectLocation) {
      return 'ui-gps';
    }

    return null;
  }
}
