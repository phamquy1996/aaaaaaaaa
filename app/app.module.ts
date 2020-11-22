import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ApplicationRef,
  APP_INITIALIZER,
  Injector,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import {
  ServiceWorkerModule,
  SwRegistrationOptions,
} from '@angular/service-worker';
import { ABTestModule } from '@freelancer/abtest';
import { Auth } from '@freelancer/auth';
import { LocationModule } from '@freelancer/location';
import {
  Login,
  LoginModule,
  LOGIN_AUTH_SERVICE,
  LOGIN_REDIRECT_SERVICE,
} from '@freelancer/login';
import { NetworkAlertModule } from '@freelancer/network';
import { NotificationsModule } from '@freelancer/notifications';
import { PwaModule, PWA_CONFIG } from '@freelancer/pwa';
import { SeoModule } from '@freelancer/seo';
import { UserAgent } from '@freelancer/user-agent';
import 'ios-service-worker-container';
import { PrebootModule } from 'preboot';
import { filter, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AppCommonModule } from './app-common.module';
import { ShellRoutingModule } from './app-shell/shell-routing.module';
import { AppComponent } from './app.component';

// YOU ARE PROBABLY LOOKING FOR app-common.module.ts !!!

// /!\ DO NOT ADD ANYTHING IN THERE WITHOUT TALKING TO FRONTEND INFRA FIRST /!\
// Application-wide code should be avoided as much as possible; does your code
// needs:
// - to be loaded on ALL logged-in pages?
// - AND to be loaded on ALL logged-out pages?
// - AND to be loaded on the Admin?
// - ...
// Probably not.

// FIXME: this is needed by @angular/preboot due to
// https://github.com/angular/preboot/issues/75
export function removeStyleTags(
  document: HTMLDocument,
  platformId: Object,
): Function {
  return () => {
    if (isPlatformBrowser(platformId)) {
      const dom = getDOM();
      const styles: any[] = Array.prototype.slice.apply(
        document.querySelectorAll(`style[ng-transition]`),
      );
      styles.forEach(el => {
        // Remove ng-transition attribute to prevent Angular appInitializerFactory
        // to remove server styles before preboot complete
        el.removeAttribute('ng-transition');
      });
      // eslint-disable-next-line no-restricted-properties
      document.addEventListener('PrebootComplete', () => {
        // After preboot complete, remove the server scripts
        setTimeout(() => styles.forEach(el => dom.remove(el)));
      });
    }
  };
}

@NgModule({
  imports: [
    AppCommonModule,
    ShellRoutingModule,
    LocationModule,
    LoginModule,
    SeoModule,
    PwaModule,
    ABTestModule,
    NetworkAlertModule,
    PrebootModule.withConfig({ appRoot: 'app-root' }),
    ServiceWorkerModule.register('ngsw-worker.js'),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    NotificationsModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: SwRegistrationOptions,
      deps: [PLATFORM_ID, Auth, Injector, UserAgent],
      useFactory: (
        platformId: Object,
        auth: Auth,
        injector: Injector,
        userAgent: UserAgent,
      ) => ({
        /* eslint-disable no-restricted-properties, no-restricted-globals */
        enabled:
          environment.production &&
          isPlatformBrowser(platformId) &&
          // disable on Edge Legacy due to prefetching issues
          // https://github.com/angular/angular/issues/27261
          userAgent.getUserAgent().getEngine()?.name !== 'EdgeHTML' &&
          // Setting a ?sw=false query param or DISABLE_NGSW=true cookie
          // disables the SW to allow testing without the Service Worker
          // running.
          !window.location.search.includes('sw=false') &&
          !window.document.cookie.includes('DISABLE_NGSW=true'),
        /* eslint-enable no-restricted-properties, no-restricted-globals */
        registrationStrategy: () =>
          // Register the SW when the user logs in & the application is idle
          auth.isLoggedIn().pipe(
            filter(isLoggedIn => isLoggedIn),
            switchMap(() =>
              injector
                .get(ApplicationRef)
                .isStable.pipe(filter(isStable => isStable)),
            ),
          ),
        scope: '/',
      }),
    },
    {
      provide: LOGIN_REDIRECT_SERVICE,
      useExisting: Login,
    },
    {
      provide: LOGIN_AUTH_SERVICE,
      useExisting: Auth,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: removeStyleTags,
      deps: [DOCUMENT, PLATFORM_ID],
      multi: true,
    },
    { provide: PWA_CONFIG, useValue: environment.pwaConfig },
  ],
})
export class AppModule {}
