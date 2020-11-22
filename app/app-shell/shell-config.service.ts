import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router,
} from '@angular/router';
import * as Rx from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { LoggedInShellConfig } from './logged-in-shell.component';
import { LoggedOutShellConfig } from './logged-out-shell.component';

/** Keep this in sync with ShellConfigTesting */
@Injectable({
  providedIn: 'root',
})
export class ShellConfig {
  constructor(private router: Router) {}

  getConfig<Config extends LoggedInShellConfig | LoggedOutShellConfig>(
    activatedRoute: ActivatedRoute,
  ): Rx.Observable<Config> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => activatedRoute.snapshot),
      startWith(activatedRoute.snapshot),
      map(snapshot => this.getRecursiveRouteData(snapshot)),
    );
  }

  /**
   * Get config from nested child routes.
   * Route data is specified in appropriate RoutingModules
   */
  getRecursiveRouteData<
    Config extends LoggedInShellConfig | LoggedOutShellConfig
  >(snapshot: ActivatedRouteSnapshot): Config {
    let { data } = snapshot;
    snapshot.children.forEach(child => {
      data = { ...data, ...this.getRecursiveRouteData(child) };
    });
    return data as Config;
  }
}
