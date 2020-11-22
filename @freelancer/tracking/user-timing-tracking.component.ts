import { Component, OnInit } from '@angular/core';
import { TimeUtils } from '@freelancer/time-utils';
import { Tracking } from './tracking.service';

export interface UserTimingEventData {
  mark_name: string;
  mark_time: number; // in ms
}

@Component({
  selector: 'fl-user-timing-tracking',
  template: `
    <ng-container></ng-container>
  `,
})
export class UserTimingTrackingComponent implements OnInit {
  private timingMarkOffset = 0; // keep track of the timing marks already reported

  constructor(private t: Tracking, private timeUtils: TimeUtils) {}

  ngOnInit() {
    // Only enable if the browser supports the User Timing API
    // (http://caniuse.com/#feat=user-timing)
    if (!(window.performance && window.performance.getEntriesByType)) {
      return;
    }
    this.reportTimingMarks();
  }

  private reportTimingMarks() {
    window.requestIdleCallback(() => {
      const marks = window.performance.getEntriesByType('mark');
      if (marks.length > this.timingMarkOffset) {
        for (let i = this.timingMarkOffset; i < marks.length; i++) {
          const mark = marks[i];
          const t = Math.round(mark.startTime);
          if (t >= 0 && t < 3600000) {
            const p: UserTimingEventData = {
              mark_name: mark.name,
              mark_time: t,
            };
            if (!mark.name.startsWith('Zone')) {
              this.t.track('user_timing', p);
            }
          }
          this.timingMarkOffset += marks.length;
        }
      }
      // Use the Page Visibility API to stop the collection if available
      if (document.hidden) {
        const onVisible = () => {
          document.removeEventListener('visibilitychange', onVisible);
          this.timeUtils.setTimeout(() => {
            this.reportTimingMarks();
          }, 1000);
        };
        document.addEventListener('visibilitychange', onVisible);
      } else {
        // TODO: Use PerformanceObserver when it's more widely supported
        // https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
        this.timeUtils.setTimeout(() => {
          this.reportTimingMarks();
        }, 1000);
      }
    });
  }
}
