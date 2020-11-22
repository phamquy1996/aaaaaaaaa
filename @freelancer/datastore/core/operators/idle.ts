import { NgZone } from '@angular/core';
import { isDefined } from '@freelancer/utils';
import * as Rx from 'rxjs';

/**
 * Create an observable that emits an empty value and complete itself when browser idle.
 * Reference: https://ncjamieson.com/how-to-use-requestidlecallback/
 */
export function idle(ngZone: NgZone): Rx.Observable<void> {
  return new Rx.Observable<void>(observer => {
    if (window) {
      let handle: number;
      // Anything in the idle callback should not be essential for
      // page rendering, so we schedule it outside the angular zone.
      ngZone.runOutsideAngular(() => {
        handle = window.requestIdleCallback(() => {
          observer.next();
          observer.complete();
        });
      });
      return () => {
        if (isDefined(handle)) {
          window.cancelIdleCallback(handle);
        }
      };
    }
  });
}
