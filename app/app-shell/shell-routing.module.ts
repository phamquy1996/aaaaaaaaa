import {
  CommonModule,
  isPlatformBrowser,
  ViewportScroller,
} from '@angular/common';
import { ApplicationRef, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, Routes, Scroll } from '@angular/router';
import { OnDemandPreloadingStrategy } from '@freelancer/preload-route';
import { PwaInstalledModeGuard } from '@freelancer/pwa';
import { filter, first, skip } from 'rxjs/operators';
import { LoggedOutRestrictedGuard } from './logged-out-restricted-guard.service';
import { ShellGuard } from './shell-guard.service';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PwaInstalledModeGuard],
    children: [
      {
        path: '',
        canActivate: [ShellGuard],
        // always run guard so we can swap shells when auth state changes
        runGuardsAndResolvers: 'always',
        data: {
          // "argument" for shell guard to avoid duplicating reroute logic
          loggedIn: true,
        },
        // if logged in, lazy-load the logged in shell
        loadChildren: () =>
          import('app/app-shell/logged-in-routing.module').then(
            m => m.LoggedInRoutingModule,
          ),
      },
      {
        path: '',
        canActivate: [ShellGuard, LoggedOutRestrictedGuard],
        runGuardsAndResolvers: 'always',
        data: {
          loggedIn: false,
        },
        loadChildren: () =>
          import('app/app-shell/logged-out-routing.module').then(
            m => m.LoggedOutRoutingModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabled',
      // FIXME: re-enable when the issue is fixed on the Anglar side
      // We effectively use 'enabled' here, but we need the hack in the
      // ShellRoutingModule constructor below in order to prevent the page from
      // scrolling back to the top with SSR (when the app itself bootstrap, if
      // the user had already started to scroll down)
      // scrollPositionRestoration: 'enabled',
      // anchorScrolling: 'enabled',
      urlUpdateStrategy: 'eager',
      preloadingStrategy: OnDemandPreloadingStrategy,
    }),
    CommonModule,
  ],
  providers: [OnDemandPreloadingStrategy],
  exports: [RouterModule],
})
export class ShellRoutingModule {
  // tslint:disable-next-line:no-code-in-constructor
  constructor(
    appRef: ApplicationRef,
    router: Router,
    viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // FIXME: find a better way to detect that.
      // eslint-disable-next-line no-restricted-globals
      const hasRenderedOnServer = !!document.querySelector(
        `style[ng-transition]`,
      );
      // FIXME: remove when the issues are fixed on the Anglar side
      router.events
        .pipe(
          filter((e): e is Scroll => e instanceof Scroll),
          // Skip(1) here skips the initial navigation which fixes an issue with
          // the page being scrolled back to the top with SSR (when the app
          // itself bootstrap, if the user had already started to scroll down)
          // tslint:disable-next-line:no-skip-one
          skip(hasRenderedOnServer ? 1 : 0),
        )
        .subscribe(e => {
          if (e.position) {
            // backward navigation
            const { position } = e;
            // setTimeout here is needed to ensure the previous page has been
            // rendered
            setTimeout(() => viewportScroller.scrollToPosition(position));
          } else if (e.anchor) {
            // anchor navigation
            const { anchor } = e;
            // FIXME: The isStable hack is needed as the Angular's default
            // `anchorScrolling` is broken since it makes no guarantee that the
            // anchor will be in the DOM before trying to scroll to it, i.e. in
            // ViewportScrolling the this.document.querySelector won't match
            // anything.
            appRef.isStable
              .pipe(first(stable => stable))
              .toPromise()
              .then(() => viewportScroller.scrollToAnchor(anchor));
          } else {
            // forward navigation
            viewportScroller.scrollToPosition([0, 0]);
          }
        });
    }
  }
}
