import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import * as Rx from 'rxjs';
import { PreloadRouteConfig } from './preload-route.config';
import { PreloadRoute } from './preload-route.service';

@Injectable()
export class OnDemandPreloadingStrategy implements PreloadingStrategy {
  constructor(private preloadRoute: PreloadRoute) {}

  preload(
    route: Route & { data?: PreloadRouteConfig },
    load: () => Rx.Observable<any>,
  ): Rx.Observable<void> {
    this.preloadRoute._registerRoute(route, load);
    return Rx.of(undefined);
  }
}
