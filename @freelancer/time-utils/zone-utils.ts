import { NgZone } from '@angular/core';
import * as Rx from 'rxjs';

// This is needed for Protractor - time-based RxJS operators need to leave the
// Angular zone. See:
// https://stackoverflow.com/questions/43121400/run-ngrx-effect-outside-of-angulars-zone-to-prevent-timeout-in-protractor/43184760
class LeaveZoneScheduler {
  constructor(private zone: NgZone, private scheduler: Rx.SchedulerLike) {}

  schedule<T>(
    work: (this: Rx.SchedulerAction<T>, state?: T) => void,
    delay?: number,
    state?: T,
  ): Rx.Subscription {
    return this.zone.runOutsideAngular(() =>
      this.scheduler.schedule(work, delay, state),
    );
  }
}

class EnterZoneScheduler {
  constructor(private zone: NgZone, private scheduler: Rx.SchedulerLike) {}

  schedule<T>(
    work: (this: Rx.SchedulerAction<T>, state?: T) => void,
    delay?: number,
    state?: T,
  ): Rx.Subscription {
    return this.zone.run(() => this.scheduler.schedule(work, delay, state));
  }
}

export function leaveZone(
  zone: NgZone,
  scheduler: Rx.SchedulerLike,
): Rx.SchedulerLike {
  return new LeaveZoneScheduler(zone, scheduler) as any;
}

export function enterZone(
  zone: NgZone,
  scheduler: Rx.SchedulerLike,
): Rx.SchedulerLike {
  return new EnterZoneScheduler(zone, scheduler) as any;
}
