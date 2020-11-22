import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
// docs say to use the polyfill as a ponyfill
import ResizeObserver from 'resize-observer-polyfill';
import * as Rx from 'rxjs';
import { StickyService } from './sticky.service';

export enum StickyBehaviour {
  ALWAYS = 'always',
  ONSCROLL = 'onscroll',
}

export enum StickyPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
}

@Directive({
  selector: `
    [flSticky],
  `,
})
export class StickyDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() flSticky = true;
  @Input() flStickyOffset = 0;
  @Input() flStickyBehaviour = StickyBehaviour.ONSCROLL;
  @Input() flStickyPosition = StickyPosition.TOP;
  @Input() flStickyOrder: number;

  /**
   * Warning
   * This makes the element not included in the stacking and gonna
   * overlap with other sticky elements
   */
  @Input() flStickyStatic = false;
  /**
   * Option if a placeholder should be
   * created when an element becomes sticky
   */
  @Input() flStickyCreatePlaceholder = true;

  @Output() activated = new EventEmitter<boolean>();

  private get isStickyTop() {
    return this.flStickyPosition === StickyPosition.TOP;
  }

  private get isAlwaysSticky() {
    return this.flStickyBehaviour === StickyBehaviour.ALWAYS;
  }

  private get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  private get markerPosition() {
    return window.scrollY + this.marker.getBoundingClientRect().top;
  }

  private isSticky = false;
  private offset = this.flStickyOffset;
  private stackHeightSubscription?: Rx.Subscription;
  private intersectionObserver: IntersectionObserver;
  private resizeObserver: ResizeObserver;
  private placeholderResizeObserver: ResizeObserver;
  private marker = this.renderer.createElement('div') as HTMLDivElement;
  private placeholder = this.renderer.createElement('div') as HTMLDivElement;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private stickyService: StickyService,
    private timeUtils: TimeUtils,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // don't set up directive on server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if ('flSticky' in changes && this.elementRef && this.flSticky) {
      this.initializeSticky();
    } else {
      this.deactivate();
      this.destroyListeners();
    }
  }

  ngAfterViewInit() {
    // don't set up directive on server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.flSticky) {
      this.timeUtils.setTimeout(() => {
        this.initializeSticky();
      });
    }
  }

  initializeSticky() {
    this.offset = this.getOffset();

    this.createMarker();

    if (this.isElementVisible()) {
      this.toggleStickyState();
    }

    if (typeof this.resizeObserver === 'undefined') {
      this.resizeObserver = new ResizeObserver(
        (entries: ResizeObserverEntry[]) => {
          requestAnimationFrame(() => {
            entries.forEach(() => {
              if (!this.isElementVisible() && this.isSticky) {
                this.deactivate();
              }

              if (this.isElementVisible()) {
                this.detectStackHeightChanges();
                this.toggleStickyState();
              }

              if (this.isSticky) {
                this.updateStickyPosition();
                this.updatePlaceholderHeight();
              }
            });
          });
        },
      );

      this.resizeObserver.observe(this.element);
    }

    this.detectStackHeightChanges();
  }

  detectStackHeightChanges() {
    if (
      typeof this.stackHeightSubscription === 'undefined' &&
      !this.flStickyStatic &&
      this.isElementVisible()
    ) {
      this.stackHeightSubscription = this.stickyService
        .stackHeightChange(this.isStickyTop)
        .subscribe(() => {
          this.offset = this.getOffset();
          this.updateMarkerPosition();

          if (this.isSticky) {
            this.updateStickyPosition();
          }
        });
    }
  }

  toggleStickyState() {
    if (this.isAlwaysSticky || this.markerPosition <= 0) {
      this.activate();
      return;
    }

    if (typeof this.intersectionObserver === 'undefined') {
      this.intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (this.isStickyTop) {
            this.toggleStickyTop(entry);
          } else {
            this.toggleStickyBottom(entry);
          }
        });
      });
      this.intersectionObserver.observe(this.marker);
    }
  }

  toggleStickyTop(entry: IntersectionObserverEntry) {
    if (!entry.isIntersecting && this.marker.getBoundingClientRect().top <= 0) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  toggleStickyBottom(entry: IntersectionObserverEntry) {
    if (entry.isIntersecting) {
      this.activate();
    } else if (this.marker.getBoundingClientRect().top > 0) {
      this.deactivate();
    }
  }

  activate() {
    if (!this.isSticky) {
      const { width } = this.element.getBoundingClientRect();

      if (this.flStickyCreatePlaceholder) {
        this.createPlaceholder();
      }

      this.updateStickyPosition();

      this.renderer.addClass(this.element, 'IsSticky');
      this.renderer.setStyle(this.element, 'position', 'fixed');
      this.renderer.setStyle(this.element, 'z-index', '1000');
      this.renderer.setStyle(this.element, 'width', `${width}px`);

      this.isSticky = true;
      this.activated.emit(true);

      if (!this.flStickyStatic) {
        this.stickyService.add(
          this.element,
          this.isStickyTop,
          this.flStickyOrder,
        );
      }
    }
  }

  deactivate() {
    if (this.isSticky) {
      this.isSticky = false;

      if (this.flStickyCreatePlaceholder) {
        this.destoryPlaceholder();
      }

      this.renderer.removeStyle(this.element, 'position');
      this.renderer.removeStyle(this.element, this.flStickyPosition);
      this.renderer.removeStyle(this.element, 'z-index');
      this.renderer.removeStyle(this.element, 'width');
      this.renderer.removeClass(this.element, 'IsSticky');

      this.activated.emit(false);

      if (!this.flStickyStatic) {
        this.stickyService.remove(this.element, this.isStickyTop);
      }
    }
  }

  private getOffset() {
    return !this.flStickyStatic
      ? this.flStickyOffset +
          this.stickyService.getOffset(this.element, this.isStickyTop)
      : this.flStickyOffset;
  }

  private updateStickyPosition() {
    this.renderer.setStyle(
      this.element,
      this.flStickyPosition,
      `${this.offset}px`,
    );
  }

  /**
   * Placeholder is created to avoid jump when component becomes sticky
   * and serves as the width basis when user resizes the screen
   */
  private createPlaceholder() {
    this.renderer.setStyle(this.placeholder, 'display', 'block');
    this.updatePlaceholderHeight();

    if (this.isAlwaysSticky || this.isStickyTop) {
      this.renderer.appendChild(this.element.parentNode, this.placeholder);
    }

    if (!this.isStickyTop && !this.isAlwaysSticky) {
      this.renderer.insertBefore(
        this.element.parentNode,
        this.placeholder,
        this.marker,
      );
    }

    // Change sticky element width if placeholder width changes
    this.placeholderResizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        requestAnimationFrame(() => {
          entries.forEach(() => {
            if (this.isSticky) {
              this.renderer.setStyle(
                this.element,
                'width',
                `${this.placeholder.offsetWidth}px`,
              );
            }
          });
        });
      },
    );

    this.placeholderResizeObserver.observe(this.placeholder);
  }

  private updatePlaceholderHeight() {
    this.renderer.setStyle(
      this.placeholder,
      'height',
      `${this.element.getBoundingClientRect().height}px`,
    );
  }

  private destoryPlaceholder() {
    // Set display to none as removing child sometimes takes time
    this.renderer.setStyle(this.placeholder, 'display', 'none');
    this.renderer.removeChild(this.element.parentNode, this.placeholder);

    if (this.placeholderResizeObserver) {
      this.placeholderResizeObserver.unobserve(this.placeholder);
    }
  }

  /**
   * Marker serves as the intersection point to decide
   * whether to activate or deactivate sticky state
   */
  private createMarker() {
    this.marker.style.position = `relative`;

    if (this.isStickyTop) {
      this.renderer.insertBefore(
        this.element.parentNode,
        this.marker,
        this.element,
      );
    } else {
      this.renderer.appendChild(this.element.parentNode, this.marker);
    }

    this.updateMarkerPosition();
  }

  private updateMarkerPosition() {
    this.renderer.setStyle(
      this.marker,
      this.flStickyPosition,
      `-${this.offset}px`,
    );
  }

  private destroyMarker() {
    this.renderer.removeChild(this.element.parentNode, this.marker);
  }

  private destroyListeners() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    if (this.stackHeightSubscription) {
      this.stackHeightSubscription.unsubscribe();
    }
  }

  private isElementVisible() {
    return this.element.offsetWidth > 0 || this.element.offsetHeight > 0;
  }

  ngOnDestroy() {
    this.destroyMarker();
    this.deactivate();
    this.destroyListeners();
  }
}
