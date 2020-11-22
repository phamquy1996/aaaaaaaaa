import { AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  PLATFORM_ID,
  TemplateRef,
} from '@angular/core';
import * as Rx from 'rxjs';
import { delay, publishReplay, refCount } from 'rxjs/operators';
import { defaultTheme } from './themes';

export enum MapSize {
  DEFAULT = 'default',
  COMPACT = 'compact',
}

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  referenceId?: MarkerReferenceId;
  location: MapCoordinates;
  icon?: MarkerIcon;
  tooltipOffset?: number;
}

export type TooltipRef = MapMarker & {
  closeTooltip(): void;
  openTooltip(): void;
};

interface MarkerIcon {
  url: string;
  scaledSize?: MarkerScale;
}

interface MarkerScale {
  height: number;
  width: number;
}

type MarkerReferenceId = string | number;

@Component({
  selector: 'fl-map-info-window',
  template: `
    <div #outerWrapper>
      <div #viewContainer></div>
    </div>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapInfoWindowComponent extends AgmSnazzyInfoWindow
  implements AfterViewInit, OnChanges {
  @Input() offset: number;

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // Offset property is not exposed publicly so we need
    // this wrapper class
    if (this._snazzyInfoWindowInitialized) {
      this._snazzyInfoWindowInitialized.then(() => {
        this._nativeSnazzyInfoWindow._opts.offset = {
          top: `${this.offset}px`,
          left: '0px',
        };
      });
    }
  }
}

@Component({
  selector: 'fl-map',
  template: `
    <!--
      hidden in e2e tests because we don't want to be forced to
      update the tests just because google changed their rendering
    -->
    <fl-bit class="MapContainer">
      <ng-container *ngIf="isBrowser; else SSRPlaceHolder">
        <agm-map
          flHideInEnd2EndTests
          *ngIf="isBrowser"
          class="MapImage"
          [attr.data-size]="size"
          [latitude]="center ? center.latitude : undefined"
          [longitude]="center ? center.longitude : undefined"
          [zoom]="zoom"
          [mapDraggable]="interactive"
          [streetViewControl]="false"
          [zoomControl]="interactive"
          [clickableIcons]="interactive"
          [disableDefaultUI]="true"
          [styles]="defaultTheme"
          [fitBounds]="shouldFitBounds"
        >
          <agm-marker
            *ngFor="let marker of markers"
            [iconUrl]="marker.icon?.url"
            [latitude]="marker.location.latitude"
            [longitude]="marker.location.longitude"
            [agmFitBounds]="shouldFitBounds"
            [openInfoWindow]="false"
            (markerClick)="markerClick(marker)"
            (mouseOver)="markerMouseHover(marker)"
            (mouseOut)="markerMouseOut()"
          >
            <fl-map-info-window
              *ngIf="marker.referenceId && tooltipTemplate"
              [border]="false"
              [borderRadius]="'0'"
              [isOpen]="(activeMarkerId$ | async) === marker.referenceId"
              [maxWidth]="'100%'"
              [offset]="marker.tooltipOffset"
              [openOnMarkerClick]="false"
              [padding]="'0'"
              [panOnOpen]="false"
              [pointer]="false"
              [shadow]="false"
              [showCloseButton]="false"
            >
              <ng-template>
                <fl-bit
                  class="InfoWindow"
                  (mouseenter)="infoWindowMouseEnter(marker)"
                  (mouseleave)="infoWindowMouseLeave()"
                >
                  <ng-template
                    [ngTemplateOutlet]="tooltipTemplate"
                  ></ng-template>
                  <fl-bit class="InfoWindow-overlay"></fl-bit>
                </fl-bit>
              </ng-template>
            </fl-map-info-window>
          </agm-marker>
        </agm-map>
      </ng-container>
    </fl-bit>

    <ng-template #SSRPlaceHolder>
      <fl-bit></fl-bit>
    </ng-template>
  `,
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnChanges, OnInit {
  // FIXME don't hardcode this?
  readonly iconUrl =
    'http://cdn5.f-cdn.com/static/css/images/ProjectPin48px.png';
  readonly defaultCustomIconScale = {
    width: 32,
    height: 32,
  };
  readonly defaultTheme = defaultTheme;
  readonly defaultIconHeight = 48;
  readonly tooltipArrowOffset = 12;

  /** Plot multiple custom markers onto the map */
  @Input() markers: ReadonlyArray<MapMarker>;
  shouldFitBounds = false;
  center?: MapCoordinates;

  /** If the user can drag/zoom/click on places*/
  @Input() interactive = false;
  /** Place a marker in the middle of the map */
  @Input() marker = true;

  @HostBinding('attr.data-size')
  @Input()
  size = MapSize.DEFAULT;
  /** TODO: Decide what zoom levels we want to support and put them into an enum.
   * Contact UI Eng if you want to use this. */
  @Input() zoom = 14;

  @Output() markerSelected = new EventEmitter<MapMarker>();
  @Output() showTooltip = new EventEmitter<TooltipRef>();

  @ContentChild('tooltipTemplate')
  tooltipTemplate: TemplateRef<any>;

  isBrowser: boolean;
  activeMarkerId$: Rx.Observable<MarkerReferenceId | undefined>;

  private activeMarkerIdSubject$ = new Rx.BehaviorSubject<
    MarkerReferenceId | undefined
  >(undefined);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.activeMarkerId$ = this.activeMarkerIdSubject$.pipe(
      // Delay needed to let succeeding events complete
      // before checking e.g marker to tooltip and vice versa
      delay(0),
      publishReplay(1),
      refCount(),
    );
  }

  ngOnChanges() {
    this.markers = this.markers.map(customMarker => ({
      ...customMarker,
      icon: this.transformIcon(customMarker.icon),
      tooltipOffset: this.getTooltipOffset(customMarker.icon),
    }));

    this.shouldFitBounds = this.markers.length > 1;

    this.center =
      this.markers.length === 1 ? this.markers[0].location : undefined;
  }

  /**
   * Snazzy info window doesn't position tooltip based on the marker's height
   * we need to manually adjust it
   */
  private getTooltipOffset(icon?: MarkerIcon) {
    const iconOffset = icon
      ? icon.scaledSize
        ? -icon.scaledSize.height
        : -this.defaultCustomIconScale.height
      : -this.defaultIconHeight;

    return iconOffset - this.tooltipArrowOffset;
  }

  private transformIcon(icon?: MarkerIcon) {
    const iconScale =
      icon && icon.scaledSize ? icon.scaledSize : this.defaultCustomIconScale;
    return icon ? { ...icon, scaledSize: iconScale } : { url: this.iconUrl };
  }

  infoWindowMouseEnter(mapMarker: MapMarker) {
    this.activeMarkerIdSubject$.next(mapMarker.referenceId);
  }

  infoWindowMouseLeave() {
    this.activeMarkerIdSubject$.next(undefined);
  }

  markerClick(mapMarker: MapMarker) {
    this.markerSelected.emit(mapMarker);
  }

  markerMouseHover(mapMarker: MapMarker) {
    this.showTooltip.emit({
      ...mapMarker,
      closeTooltip: () => {
        this.activeMarkerIdSubject$.next(undefined);
      },
      openTooltip: () => {
        this.activeMarkerIdSubject$.next(mapMarker.referenceId);
      },
    });
  }

  markerMouseOut() {
    this.activeMarkerIdSubject$.next(undefined);
  }

  // TODO: handle longpress for touchscreens
  // On mobile, the tooltip is displayed when the user longpresses the element
  // and hides after a delay of 1500ms.
}
