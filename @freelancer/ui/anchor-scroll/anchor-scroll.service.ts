import { isPlatformServer } from '@angular/common';
import { ErrorHandler, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { UserAgent } from '@freelancer/user-agent';
import * as Rx from 'rxjs';

interface AnchorRef {
  name: string;
  el: HTMLElement;
  cleanup?(): void;
}

type Anchors = {
  [key in string]: AnchorRef;
};

interface AnchorScrollOptions {
  name: string;
  onlyIfNeeded?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnchorScroll {
  private anchors: Anchors = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private errorHandler: ErrorHandler,
    private ua: UserAgent,
  ) {}

  /**
   * Scroll to an anchor.
   *
   * Returns a scrolling animation stream.
   * Use that to show a loading state while the animation is running to reduce
   * stutter & improve the UX.
   */
  scrollTo(
    anchorNameOrOptions: string | AnchorScrollOptions,
  ): Rx.Observable<boolean> {
    const name =
      typeof anchorNameOrOptions !== 'string'
        ? anchorNameOrOptions.name
        : anchorNameOrOptions;
    const anchor = this.anchors[name];
    const onlyIfNeeded =
      typeof anchorNameOrOptions !== 'string'
        ? anchorNameOrOptions.onlyIfNeeded
        : false;

    if (isPlatformServer(this.platformId)) {
      throw new Error(
        `scrollTo() cannot be called on the server. If you want to scroll on page load, put a fragment (#${name}) in the link URL instead.`,
      );
    }

    if (!anchor) {
      this.errorHandler.handleError(
        new Error(`Anchor '${name}' does not exist`),
      );
      return Rx.of(false);
    }
    if (anchor.cleanup) {
      anchor.cleanup();
    }

    const isScrollingSubject$ = new Rx.BehaviorSubject<boolean>(true);
    const bounding = anchor.el.getBoundingClientRect();
    // Don't scroll it onlyIfNeeded is true & the anchor is already in the viewport
    if (
      onlyIfNeeded &&
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= window.innerWidth &&
      bounding.bottom <= window.innerHeight
    ) {
      setTimeout(() => {
        isScrollingSubject$.next(false);
      });
    } else {
      // Is the browser supporting passive events?
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get() {
            supportsPassive = true;
          },
        });
        window.addEventListener('testPassive', null as any, opts);
        window.removeEventListener('testPassive', null as any, opts);
      } catch (e) {
        // ignore
      }
      // Detect when top of the list has been reached
      const observer = new IntersectionObserver(changes => {
        if (changes[0].isIntersecting) {
          if (anchor.cleanup) {
            anchor.cleanup();
          }
        }
      });
      observer.observe(anchor.el);
      // Called when the animation completes
      const cleanup = () => {
        if (observer) {
          observer.disconnect();
        }
        document.removeEventListener(
          'touchstart',
          cleanup,
          supportsPassive ? ({ passive: true } as EventListenerOptions) : false,
        );
        document.removeEventListener(
          'wheel',
          cleanup,
          supportsPassive ? ({ passive: true } as EventListenerOptions) : false,
        );
        isScrollingSubject$.next(false);
      };
      anchor.cleanup = cleanup;
      // Detect if the animation is interrupted
      document.addEventListener(
        'touchstart',
        cleanup,
        supportsPassive ? { passive: true } : false,
      );
      document.addEventListener(
        'wheel',
        cleanup,
        supportsPassive ? { passive: true } : false,
      );
      // Scroll the the anchor
      setTimeout(() => {
        if (
          (this.ua.getUserAgent().getBrowser().version || '').startsWith('79')
        ) {
          // TODO: remove that when Chrome 79 has retired.
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1036378
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1038039
          // Native smooth scrolling is broken in certain scenarios in Chrome 79,
          // fixed in 80.
          // This catches Edge/Chromnium and other Blink-based browser on purpose
          // as the issue is in Blink.
          // This does the trick as Scroll-behavior is not yet supported for
          // Element.scrollIntoView() in Chrome, i.e. the polyfill will take
          // over.
          anchor.el.scrollIntoView({
            behavior: 'smooth',
          });
        } else {
          // In theory this could just be scrollIntoView(), but Scroll-behavior
          // is not yet supported for Element.scrollIntoView() in Chrome.
          window.scrollTo({
            top: anchor.el.getBoundingClientRect().top + window.pageYOffset,
            behavior: 'smooth',
          });
        }
      });
    }

    return isScrollingSubject$.asObservable();
  }

  // PRIVATE
  // Used by the fl-anchor-scroll component to register a new anchor
  registerAnchor(name: string, el: HTMLElement): void {
    if (this.anchors[name]) {
      this.errorHandler.handleError(
        new Error(`Anchor '${name}' is already registered`),
      );
      return;
    }
    this.anchors[name] = { name, el };
  }

  // PRIVATE
  // Used by the fl-anchor-scroll component to unregister an anchor
  unregisterAnchor(name: string): void {
    const anchor = this.anchors[name];
    if (!anchor) {
      this.errorHandler.handleError(
        new Error(`Anchor '${name}' does not exist`),
      );
      return;
    }
    if (anchor.cleanup) {
      anchor.cleanup();
    }
    delete this.anchors[name];
  }
}
