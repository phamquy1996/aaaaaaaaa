import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import * as Rx from 'rxjs';
import { PreloadModule, PreloadRouteConfig } from './preload-route.config';

@Injectable({
  providedIn: 'root',
})
/*
 * This allows to preload the route bundle of a lazy-loaded route, e.g. we you
 * know that the user is likely going to go somewhere else next, preloading the
 * route bundle will make the route transition faster (otherwise the route
 * bundle will just be loaded during the navigation).
 *
 * In order to use it, copy the NgModule path into a preloadModule route data
 * entry, and call PreloadRoute:preload with said preloadModule name.
 *
 * While the route itself won't be loaded, be aware that there's still a
 * (small) cost parsing the bundle & executing the wrapper, so make sure to
 * call PreloadRoute:preload only when the user is idle, e.g. waiting on an API
 * response, or it could create jitter due to the skipped frames.
 *
 * TODO: scrap this whole thing once Ivy has landed as we can just do
 * `import()` instead.
 */
export class PreloadRoute {
  routes: { [path: string]: Function } = {};
  allRoutes: (() => Rx.Observable<any>)[] = [];

  preload(preloadModule: PreloadModule) {
    const load = this.routes[preloadModule];
    if (load) {
      load();
    }
    // Don't log an error here as the preloadModule won't be registered if the
    // app started while on the route to preload, as the route config would
    // have already been loaded by Angular.
    // This means preloadModule typos should be detected through a lint rule,
    // not at runtime.
  }

  /**
   * @private
   * Preload all the application routes
   */
  preloadAll(): Promise<void> {
    return Promise.all(this.allRoutes.map(load => load().toPromise())).then(
      () => undefined,
    );
  }

  /**
   * @private
   * Only to be used by the OnDemandPreloadingStrategy helper service
   */
  _registerRoute(
    route: Route & { data?: PreloadRouteConfig },
    load: () => Rx.Observable<any>,
  ): void {
    if (route.data && route.data.preloadModule) {
      this.routes[route.data.preloadModule] = load;
    }
    this.allRoutes.push(load);
  }
}
