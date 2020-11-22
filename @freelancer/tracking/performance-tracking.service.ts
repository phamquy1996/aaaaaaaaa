import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Tracking } from './tracking.service';

export interface UserTimingEventData {
  mark_name: string;
  mark_time: number; // in ms
}

@Injectable()
export class PerformanceTracking {
  constructor(
    private t: Tracking,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  mark(name: string, report: boolean = false): void {
    if (
      isPlatformBrowser(this.platformId) &&
      window.performance &&
      window.performance.mark
    ) {
      window.performance.mark(name);
      if (report) {
        const entries = window.performance.getEntriesByName(name);
        const mark = entries[entries.length - 1];
        // in theory the mark should always be defined but in practice it
        // happens to be undefined but in some rare times, probably because of
        // browser bugs and/or because the browser is busy navigating away
        if (mark) {
          const t = Math.round(mark.startTime);
          const p: UserTimingEventData = {
            mark_name: mark.name,
            mark_time: t,
          };
          this.t.track('user_timing', p);
        }
      }
    }
  }

  measure(name: string, startMark: string, endMark: string): void {
    if (
      isPlatformBrowser(this.platformId) &&
      window.performance &&
      window.performance.measure
    ) {
      window.performance.measure(name, startMark, endMark);
    }
  }
}
