import { Injectable, NgZone } from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { ErrorTracking } from './error-tracking.service';

@Injectable({ providedIn: 'root' })
export class MemoryLeakTracking {
  readonly CHECK_INTERVAL = 10000; // 10 seconds
  readonly MAX_MEMORY_LIMIT = 1000 * 1048576; // 1000MB
  readonly MAX_PERCENT_THRESHOLD = 90;

  constructor(
    private errorTracking: ErrorTracking,
    private timeUtils: TimeUtils,
    private ngZone: NgZone,
  ) {}

  monitor() {
    this.timeUtils.setTimeout(() => {
      this.checkMemoryUsage();
    }, this.CHECK_INTERVAL);
  }

  private checkMemoryUsage() {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        let hasAlarmed = false;
        const {
          jsHeapSizeLimit,
          totalJSHeapSize,
          usedJSHeapSize,
        } = (window.performance as any).memory;

        // Check if we've exceeded absolute memory limit
        if (usedJSHeapSize > this.MAX_MEMORY_LIMIT) {
          hasAlarmed = true;
          const overage = usedJSHeapSize - this.MAX_MEMORY_LIMIT;
          this.errorTracking.captureMessage('Exceeded memory maximum limit', {
            extra: {
              jsHeapSizeLimit,
              totalJSHeapSize,
              usedJSHeapSize,
              overage,
            },
          });
        }

        // Check if we've exceeded relative memory limit for client
        if (
          usedJSHeapSize >
          (this.MAX_PERCENT_THRESHOLD / 100) * jsHeapSizeLimit
        ) {
          hasAlarmed = true;
          this.errorTracking.captureMessage('Memory usage exceeded', {
            extra: {
              jsHeapSizeLimit,
              totalJSHeapSize,
              usedJSHeapSize,
              MAX_PERCENT_THRESHOLD: this.MAX_PERCENT_THRESHOLD,
            },
          });
        }

        // Only alert once
        if (!hasAlarmed) {
          this.timeUtils.setTimeout(() => {
            this.checkMemoryUsage();
          }, this.CHECK_INTERVAL);
        }
      });
    });
  }
}
