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
  Output,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
// docs say to use the polyfill as a ponyfill
import ResizeObserver from 'resize-observer-polyfill';
import * as Rx from 'rxjs';
import { filter, scan, withLatestFrom } from 'rxjs/operators';
import { InfiniteScrollContainerDirective } from './infinite-scroll-container.directive';

/**
 * Allows to implement an infinite scrolling pattern
 *
 * Given a `hasMoreItems` boolean, and with an `[flInfiniteScrollContainer]`
 * directive placed onto the container, this emits a new `limit` when new data
 * should be loaded, e.g. when the user is close to reaching the bottom of the
 * list.
 */
@Component({
  selector: 'fl-infinite-scroll',
  template: `
    <fl-spinner *ngIf="hasMoreItems"></fl-spinner>
  `,
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollComponent
  implements AfterViewInit, OnChanges, OnDestroy {
  @HostBinding('attr.has-more-items')
  @Input()
  hasMoreItems: boolean;
  @Output() limit: EventEmitter<number> = new EventEmitter();

  private isViewInit: boolean;
  private lastHeight: number;
  private isVisible: boolean;
  private intersectionObserver: IntersectionObserver;
  private resizeObserver: ResizeObserver;

  private PAGE_SIZE = 10;
  private loadMoreSubject$ = new Rx.Subject<void>();
  private loadMoreSubscription?: Rx.Subscription;

  constructor(
    private el: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private containerRef: InfiniteScrollContainerDirective,
  ) {}

  setup() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMoreSubscription = this.loadMoreSubject$
        .asObservable()
        .pipe(
          withLatestFrom(Rx.of(this.hasMoreItems)),
          filter(([, hasMoreItems]) => hasMoreItems),
          scan((acc, curr) => acc + this.PAGE_SIZE, this.PAGE_SIZE),
        )
        .subscribe(limit => {
          this.limit.emit(limit);
          this.changeDetectorRef.detectChanges();
        });

      // Detect when the sentinel is less than 2 viewports away from the
      // current scroll position
      this.intersectionObserver = new IntersectionObserver(
        changes => {
          if (changes.some(change => change.isIntersecting)) {
            this.lastHeight = this.containerRef.container.clientHeight;
            this.isVisible = true;
            this.loadMoreSubject$.next();
          } else {
            this.isVisible = false;
          }
        },
        {
          // the 200% allows the observer to trigger early, before the bottom
          // of the list is reached
          rootMargin: '0px 0px 200% 0px',
        },
      );
      this.intersectionObserver.observe(this.el.nativeElement);

      // Detect if the sentinel is still into IntersectionObserver detection
      // zone view when new data has been loaded
      this.resizeObserver = new ResizeObserver(
        (observerEntries: ResizeObserverEntry[]) => {
          if (this.isVisible) {
            setTimeout(() => {
              if (this.isVisible) {
                const entry = observerEntries.find(
                  e => e.contentRect.height >= this.lastHeight,
                );
                if (entry) {
                  this.lastHeight = entry.contentRect.height;
                  this.loadMoreSubject$.next();
                }
              }
            });
          }
        },
      );
      this.resizeObserver.observe(this.containerRef.container);
    }
  }

  cleanup() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    if (this.loadMoreSubscription) {
      this.loadMoreSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.isViewInit = true;
    if (this.hasMoreItems) {
      this.setup();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isViewInit && 'hasMoreItems' in changes) {
      if (changes.hasMoreItems.currentValue) {
        this.setup();
      } else {
        this.cleanup();
      }
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }
}
