import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import * as Rx from 'rxjs';
import { debounceTime, observeOn, take, tap, toArray } from 'rxjs/operators';
import { enterZone, leaveZone } from './zone-utils';

// tslint:disable: validate-timers

export type Timer = ReturnType<typeof setTimeout>;

/** Keep this in sync with TimeUtilsTesting */
@Injectable({ providedIn: 'root' })
export class TimeUtils {
  readonly HOURS_IN_DAY = 24;
  readonly MILLIS_IN_SEC = 1000;
  readonly SECS_IN_DAY = 86400;
  readonly SECS_IN_HOUR = 3600;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setTimeout(callback: (...args: any[]) => void, timeout = 0): Timer {
    return this.ngZone.runOutsideAngular(() =>
      setTimeout(() => this.ngZone.run(callback), timeout),
    );
  }

  /**
   * Returns a list of years between the given years.
   *
   * @param start Start year
   * @param end End year
   */
  getListOfYears(
    start: number,
    end: number,
  ): Rx.Observable<ReadonlyArray<number>> {
    return Rx.range(start, end - start + 1).pipe(take(end - start), toArray());
  }

  /**
   * Returns a duration in milliseconds rounded up to the nearest day.
   * Duration must be passed in as milliseconds.
   *
   * @param millis Duration
   */
  roundDuration(millis: number): number {
    let seconds = millis / this.MILLIS_IN_SEC;
    const hours = Math.floor((seconds % this.SECS_IN_DAY) / this.SECS_IN_HOUR);
    seconds += (this.HOURS_IN_DAY - hours) * this.SECS_IN_HOUR;
    return seconds * this.MILLIS_IN_SEC;
  }

  rxTimer(
    delay: number,
    periodOrScheduler?: Rx.SchedulerLike | number,
    scheduler: Rx.SchedulerLike = Rx.asyncScheduler,
  ): Rx.Observable<number> {
    return Rx.timer(
      delay,
      periodOrScheduler,
      leaveZone(this.ngZone, scheduler),
    ).pipe(observeOn(enterZone(this.ngZone, scheduler)));
  }

  rxInterval(
    interval: number,
    scheduler: Rx.SchedulerLike = Rx.asyncScheduler,
  ): Rx.Observable<number> {
    return Rx.interval(interval, leaveZone(this.ngZone, scheduler)).pipe(
      observeOn(enterZone(this.ngZone, scheduler)),
    );
  }

  rxDebounceTime<T>(
    dueTime: number,
    scheduler: Rx.SchedulerLike = Rx.asyncScheduler,
  ): Rx.MonoTypeOperatorFunction<T> {
    return Rx.pipe(
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          if (window.webapp.webappE2ePendingTasksOutsideNgZone) {
            window.webapp.webappE2ePendingTasksOutsideNgZone += 1;
          }
          window.webapp.webappE2ePendingTasksOutsideNgZone = 1;
        }
      }),
      observeOn(leaveZone(this.ngZone, scheduler)),
      debounceTime<T>(dueTime, scheduler),
      observeOn(enterZone(this.ngZone, scheduler)),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          if (window.webapp.webappE2ePendingTasksOutsideNgZone) {
            window.webapp.webappE2ePendingTasksOutsideNgZone -= 1;
          }
          window.webapp.webappE2ePendingTasksOutsideNgZone = 0;
        }
      }),
    );
  }
}
