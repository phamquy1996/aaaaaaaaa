import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as Rx from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Network {
  isOnline$: Rx.Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.isOnline$ = Rx.merge(
        Rx.fromEvent(window, 'online'),
        Rx.fromEvent(window, 'offline'),
      ).pipe(map(({ type }) => type === 'online'));
    } else {
      this.isOnline$ = Rx.of(true);
    }
  }
}
