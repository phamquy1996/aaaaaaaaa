import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Assets } from '../assets';
import { FreelancerBreakpoints } from '../breakpoints';

export interface PictureImage {
  src: string;
  alt: string;
}

export enum PictureDisplay {
  INLINE = 'inline',
  BLOCK = 'block',
}

export enum PictureObjectFit {
  CONTAIN = 'contain',
  COVER = 'cover',
  NONE = 'none',
  SCALE_DOWN = 'scale-down',
}

@Component({
  selector: 'fl-picture',
  template: `
    <picture
      #container
      class="PictureElement"
      [ngClass]="{ IsShown: !lazyLoad || hasLazyLoadSupport || withinView }"
      [attr.data-display]="display"
      [attr.data-bounded-height]="boundedHeight"
      [attr.data-aspect-ratio]="fixedAspectRatio"
    >
      <source
        *ngIf="largeDesktopPicSource"
        [media]="FreelancerBreakpoints.DESKTOP_LARGE"
        [srcset]="
          !lazyLoad || hasLazyLoadSupport || withinView
            ? largeDesktopPicSource
            : undefined
        "
      />
      <source
        *ngIf="desktopPicSource"
        [media]="FreelancerBreakpoints.DESKTOP_SMALL"
        [srcset]="
          !lazyLoad || hasLazyLoadSupport || withinView
            ? desktopPicSource
            : undefined
        "
      />
      <source
        *ngIf="tabletPicSource"
        [media]="FreelancerBreakpoints.TABLET"
        [srcset]="
          !lazyLoad || hasLazyLoadSupport || withinView
            ? tabletPicSource
            : undefined
        "
      />
      <source
        *ngIf="pictureSource"
        [srcset]="
          !lazyLoad || hasLazyLoadSupport || withinView
            ? pictureSource
            : undefined
        "
      />
      <img
        class="ImageElement"
        [attr.data-display]="display"
        [attr.data-full-width]="fullWidth"
        [attr.data-bounded-width]="boundedWidth"
        [attr.data-bounded-height]="boundedHeight"
        [attr.data-align-center]="alignCenter"
        [attr.data-object-fit]="objectFit"
        [attr.data-aspect-ratio]="fixedAspectRatio"
        [attr.loading]="lazyLoad ? 'lazy' : undefined"
        [src]="
          !lazyLoad || hasLazyLoadSupport || withinView
            ? legacyPictureSource
            : undefined
        "
        [alt]="alt"
        (load)="handleImageLoad()"
        (error)="handleImageError()"
      />
    </picture>
  `,
  styleUrls: ['./picture.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PictureComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  FreelancerBreakpoints = FreelancerBreakpoints;

  @Input() src: string;
  @Input() alt: string;

  /** Forces the image to always have 100% of the width of its parent,
   * no matter how big or small it is */
  @Input() fullWidth: boolean;

  /** This ensures that the image will not overflow to its parent container by adding a max-width 100%
   * This mostly useful if you want your image to adjust accordingly on smaller
   * screens while keeping its original width on bigger screens. */
  @Input() boundedWidth?: boolean;

  /** This ensures that the image will not overflow to its parent container's height */
  @Input() boundedHeight?: boolean;

  /** Center aligns the image by setting the horizontal margins to auto */
  @Input() alignCenter?: boolean;

  /** Support external source of the image */
  @Input() externalSrc = false;

  /** Change the object-fit of the img element inside the component */
  @Input() objectFit?: PictureObjectFit;

  /** Fallback image source if image doesn't load */
  @Input() fallbackSrc: string;

  @Input() srcTablet?: string;

  @Input() srcDesktop?: string;

  @Input() srcLargeDesktop?: string;

  /** Forces image to follow our standard aspect ratio with an object fit cover */
  @HostBinding('attr.data-aspect-ratio')
  @Input()
  fixedAspectRatio = false;

  /** This variable sets the native loading property of img to lazy */
  @Input() lazyLoad = false;

  @HostBinding('attr.data-display')
  @Input()
  display: PictureDisplay;

  @Output() imageLoaded = new EventEmitter<void>();
  @Output() onError = new EventEmitter<void>();

  pictureSource: string;
  /** This is to get the largest source image to display for IE */
  legacyPictureSource: string;

  tabletPicSource: string;
  desktopPicSource: string;
  largeDesktopPicSource: string;

  /** This tracks the position of the image relative to the screen. This is needed as a fallback for browsers with no native lazy load support */
  private observer: IntersectionObserver;
  /** This marks that the image should be loaded */
  withinView = false;
  /** This is set to false in SSR */
  hasLazyLoadSupport = false;

  @ViewChild('container') container: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private assets: Assets,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.hasLazyLoadSupport = 'loading' in HTMLImageElement.prototype;
  }

  ngAfterViewInit() {
    if (this.lazyLoad && !this.hasLazyLoadSupport) {
      const config = {
        rootMargin: '100%',
      };
      if (isPlatformBrowser(this.platformId)) {
        this.observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.intersectionRatio === 0) {
              return;
            }
            this.withinView = true;
            this.observer.unobserve(this.container.nativeElement);
            this.changeDetector.detectChanges();
          });
        }, config);
        this.observer.observe(this.container.nativeElement);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      'src' in changes ||
      'externalSrc' in changes ||
      'srcTablet' in changes ||
      'srcDesktop' in changes ||
      'srcLargeDesktop' in changes
    ) {
      this.pictureSource = this.externalSrc
        ? this.src
        : this.assets.getUrl(this.src);

      if (this.srcTablet) {
        this.tabletPicSource = this.externalSrc
          ? this.srcTablet
          : this.assets.getUrl(this.srcTablet);
      }

      if (this.srcDesktop) {
        this.desktopPicSource = this.externalSrc
          ? this.srcDesktop
          : this.assets.getUrl(this.srcDesktop);
      }

      if (this.srcLargeDesktop) {
        this.largeDesktopPicSource = this.externalSrc
          ? this.srcLargeDesktop
          : this.assets.getUrl(this.srcLargeDesktop);
      }

      this.legacyPictureSource =
        this.largeDesktopPicSource ??
        this.desktopPicSource ??
        this.tabletPicSource ??
        this.pictureSource;
    }
  }

  handleImageLoad() {
    this.imageLoaded.emit();
  }

  handleImageError() {
    if (this.fallbackSrc) {
      this.pictureSource = this.assets.getUrl(this.fallbackSrc);
    }

    this.onError.emit();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.unobserve(this.container.nativeElement);
    }
  }
}
