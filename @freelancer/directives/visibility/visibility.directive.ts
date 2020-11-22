import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import * as Rx from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  take,
} from 'rxjs/operators';

export interface VisibilityOptions {
  threshold: number;
  debounce: number;
  margin: string;
}

/**
 * Fire element visibility changes for user.
 *
 * ### (seen)
 * Fire once when element is visible in user's viewport.
 * # Example:
 * <fl-bit flVisibility (seen)="handleSeen()">...</fl-bit>
 */
@Directive({
  selector: `[flVisibility]`,
})
export class VisibilityDirective implements AfterViewInit, OnDestroy {
  @Output() seen: EventEmitter<void> = new EventEmitter();

  private options: VisibilityOptions = {
    threshold: 1.0, // how much of an object should be visible to fire seen
    debounce: 1000, // how many ms to wait before firing seen
    margin: '0px', // root element bounding box margins
  };

  private observer: IntersectionObserver;

  private _isIntersectingSubject$ = new Rx.BehaviorSubject(false);

  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {}

  ngAfterViewInit() {
    // don't do on the server
    if (isPlatformBrowser(this.platformId)) {
      const config = {
        rootMargin: this.options.margin,
        threshold: this.options.threshold,
      };

      this.observer = new IntersectionObserver(
        entries =>
          this._isIntersectingSubject$.next(
            entries.find(e => e.isIntersecting) !== undefined,
          ),
        config,
      );
      this.observer.observe(this.el.nativeElement);
    }

    this._isIntersectingSubject$
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        filter(isIntersecting => isIntersecting),
        take(1),
      )
      .toPromise()
      .then(() => {
        this.clean();
        this.seen.emit();
      });
  }

  ngOnDestroy() {
    this.clean();
  }

  clean() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
