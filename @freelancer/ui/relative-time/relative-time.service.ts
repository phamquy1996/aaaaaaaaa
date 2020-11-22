import { Injectable } from '@angular/core';
import { Timer, TimeUtils } from '@freelancer/time-utils';

@Injectable({ providedIn: 'root' })
export class RelativeTime {
  constructor(private timeUtils: TimeUtils) {}

  scheduleTick(tick: () => void, timeout: number): Timer {
    return this.timeUtils.setTimeout(tick, timeout);
  }
}
