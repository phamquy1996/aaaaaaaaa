import {
  ChangeDetectionStrategy,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as Rx from 'rxjs';
import { debounceTime, filter, map, startWith, take } from 'rxjs/operators';
import { getCLS, getFID, getLCP, Metric } from 'web-vitals';
import { Tracking } from './tracking.service';

@Component({
  selector: 'fl-core-web-vitals-tracking',
  template: `
    <ng-container></ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreWebVitalsTrackingComponent implements OnDestroy, OnInit {
  coreWebVitalsSubscription?: Rx.Subscription;
  hasReportedInitial = false;

  constructor(private ngZone: NgZone, private t: Tracking) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(async () => {
      const lcp$ = new Rx.Observable<Metric>(observer => {
        // Reports final on `keydown`, `pointerdown`, `scroll`
        // or `visibilitychange` becomes `hidden`
        // Note that this won't report anything if page is hidden
        // before API initializes
        getLCP((metric: Metric) => {
          observer.next(metric);
          observer.complete();
        });
      });

      const fid$ = new Rx.Observable<Metric>(observer => {
        // Reports final on `keydown`, `pointerdown`
        // Note that this won't report anything if page is hidden
        // before API initializes
        getFID((metric: Metric) => {
          observer.next(metric);
          observer.complete();
        });
      });

      const cls$ = new Rx.Observable<Metric>(observer => {
        // Report all changes
        getCLS((metric: Metric) => {
          observer.next(metric);
        }, true);
      });

      // Fallback if user did not interact with page before page is hidden
      const fidOrHidden$ = Rx.merge(
        fid$,
        Rx.fromEvent(document, 'visibilitychange').pipe(
          filter(() => document.visibilityState === 'hidden'),
          map(() => undefined),
          take(1),
        ),
      ).pipe(take(1));

      // Wait for all three core web vitals before tracking on initial page load
      this.coreWebVitalsSubscription = Rx.combineLatest([
        fidOrHidden$,
        // Initial value for LCP and CLS needed for unsupported browsers
        lcp$.pipe(startWith(undefined)),
        cls$.pipe(
          startWith(undefined),
          // Can fire frequently for highly dynamic views
          debounceTime(500),
        ),
      ]).subscribe(([fid, lcp, cls]) => {
        // Don't track if we have no metrics, it's possible
        // if page is loaded in the background
        if (!fid && !lcp && !cls) {
          return;
        }

        this.t.track('core_web_vitals_timings', {
          fid: this.hasReportedInitial ? undefined : fid?.delta, // in ms
          lcp: this.hasReportedInitial ? undefined : lcp?.delta, // in ms
          cls: cls?.value, // take current value since it changes over time
        });

        // Report LCP and FID once
        this.hasReportedInitial = true;
      });
    });
  }

  ngOnDestroy() {
    if (this.coreWebVitalsSubscription) {
      this.coreWebVitalsSubscription.unsubscribe();
    }
  }
}
