import { Injectable } from '@angular/core';
import { Interface } from '@freelancer/types';
import { PerformanceTracking } from '../performance-tracking.service';

@Injectable()
export class PerformanceTrackingTesting
  implements Interface<PerformanceTracking> {
  mark(name: string, report: boolean = false): void {
    // Do nothing
  }

  measure(name: string, startMark: string, endMark: string): void {
    // Do nothing
  }
}
