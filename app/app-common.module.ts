import { HttpClientXsrfModule } from '@angular/common/http';
import {
  ErrorHandler,
  NgModule,
  NgModuleFactoryLoader,
  PLATFORM_ID,
  SystemJsNgModuleLoader,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ABTest,
  ABTestOverrides,
  ABTEST_WHITELIST_COOKIE,
} from '@freelancer/abtest';
import { ABTestTesting } from '@freelancer/abtest/testing';
import { Auth, AuthModule, AUTH_CONFIG } from '@freelancer/auth';
import { AuthTesting } from '@freelancer/auth/testing';
import { CAPTCHA_CONFIG } from '@freelancer/captcha';
import {
  APPS_DOMAINS_MAP,
  APP_NAME,
  ENVIRONMENT_NAME,
  SITE_NAME,
} from '@freelancer/config';
import {
  CustomFieldsValidator,
  CustomFieldsValidatorTesting,
} from '@freelancer/custom-fields';
import {
  datastoreActionSanitizer,
  DatastoreModule,
} from '@freelancer/datastore';
import * as collections from '@freelancer/datastore/collections';
import * as collectionsTesting from '@freelancer/datastore/collections-testing';
import { datastoreInitializer } from '@freelancer/datastore/collections-testing';
import { DatastoreFakeModule } from '@freelancer/datastore/testing';
import { DepositsModule } from '@freelancer/deposits';
import { FACEBOOK_CONFIG } from '@freelancer/facebook';
import { FileDownloadModule } from '@freelancer/file-download';
import { FileUploadLegacyModule } from '@freelancer/file-upload-legacy';
import {
  FreelancerHttp,
  FREELANCER_HTTP_ABTEST_OVERRIDES_PROVIDER,
  FREELANCER_HTTP_AUTH_PROVIDERS,
  FREELANCER_HTTP_CONFIG,
} from '@freelancer/freelancer-http';
import { BackgroundGeolocation } from '@freelancer/geolocation';
import { GoogleMapsModule } from '@freelancer/google-maps';
import { LANGUAGE_COOKIE } from '@freelancer/localization';
import {
  FREELANCER_LOCATION_AUTH_PROVIDER,
  FREELANCER_LOCATION_HTTP_BASE_URL_PROVIDER,
  // FIXME: use ESLint overrides to allow restricted imports in
  // app-common.module.ts
  // eslint-disable-next-line no-restricted-imports
  FREELANCER_LOCATION_PWA_PROVIDER,
  Location,
} from '@freelancer/location';
import { LOGIN_CONFIG } from '@freelancer/login';
import {
  ARROW_LOGIN_SIGNUP_MARKETING_CONFIG,
  LoginSignupModule,
} from '@freelancer/login-signup';
// FIXME: use ESLint overrides to allow restricted imports in
// app-common.module.ts
// eslint-disable-next-line no-restricted-imports
import { FREELANCER_PWA_TRACKING_PROVIDER, Pwa } from '@freelancer/pwa';
import { SEO_CONFIG } from '@freelancer/seo';
import { ThreatmetrixModule } from '@freelancer/threatmetrix';
import {
  CustomErrorHandler,
  ErrorTracking,
  FacebookPixelTracking,
  GoogleTracking,
  PerformanceTracking,
  Tracking,
  TrackingModule,
} from '@freelancer/tracking';
import {
  ErrorTrackingTesting,
  FacebookPixelTrackingTesting,
  GoogleTrackingTesting,
  PerformanceTrackingTesting,
  TrackingTesting,
} from '@freelancer/tracking/testing';
import { UiModule } from '@freelancer/ui';
import { ModalModule } from '@freelancer/ui/modal';
import { UiModalsModule } from '@freelancer/ui/ui-modals.module';
import { CookieModule, COOKIE_OPTIONS } from '@laurentgoudet/ngx-cookie';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ActionSanitizer } from '@ngrx/store-devtools/src/config';
import { environment } from '../environments/environment';
import { AppModalsModule } from './app-modals.module';
import { cookieOptionsFactory } from './cookie-options.factory';

/* The type for ActionSanitizer doesn't allow a custom action type.
 * ActionSanitizer probably should be
 *  export declare type ActionSanitizer<A extends Action = Action> = (
 *    action: A,
 *    id: number,
 *  ) => A;
 * but it isn't so let's cast through `any` for now.
 */
const actionSanitizer: ActionSanitizer = datastoreActionSanitizer as any;

// /!\ DO ADD ANYTHING IN THERE WITHOUT TALKING TO FRONTEND INFRA FIRST /!\
// Application-wide code should be avoided as much as possible; does your code
// needs:
// - to be loaded on ALL logged-in pages?
// - AND to be loaded on ALL logged-out pages?
// - AND to be loaded on the Admin?
// - ...
// Probably not.
@NgModule({
  imports: [
    AuthModule,
    BrowserModule.withServerTransition({ appId: 'webapp' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientXsrfModule.disable(), // no part of the app should rely on that
    AppModalsModule,
    DepositsModule,
    UiModalsModule,
    GoogleMapsModule.forRoot(environment.mapsConfig),
    UiModule.initialize(environment.uiConfig),
    ModalModule,
    CookieModule.forRoot(),
    ThreatmetrixModule.initialize(environment.threatmetrixConfig),
    environment.useFakes
      ? DatastoreFakeModule.initialize({
          debug: false,
          initializer: datastoreInitializer(),
          /** mixins from `collections`, create functions and push transformers from `collectionsTesting` */
          documentCreators: { ...collections, ...collectionsTesting },
        })
      : DatastoreModule.initialize({
          webSocketUrl: environment.datastoreConfig.webSocketUrl,
          enableStoreFreeze: environment.datastoreConfig.enableStoreFreeze,
          httpAdapter: FreelancerHttp,
          requestData: {},
        }),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 150,
          actionSanitizer,
          actionsBlocklist: ['LOCAL_CACHE_FETCH_SUCCESS'],
        })
      : [],
    TrackingModule.initialize(environment.trackingConfig),
    FileUploadLegacyModule,
    LoginSignupModule,
    FileDownloadModule,
  ],
  providers: [
    { provide: AUTH_CONFIG, useValue: environment.authConfig },
    environment.useFakes
      ? [
          { provide: ABTest, useClass: ABTestTesting },
          { provide: Auth, useClass: AuthTesting },
          {
            provide: CustomFieldsValidator,
            useClass: CustomFieldsValidatorTesting,
          },
          { provide: Tracking, useClass: TrackingTesting },
          { provide: ErrorTracking, useClass: ErrorTrackingTesting },
          {
            provide: PerformanceTracking,
            useClass: PerformanceTrackingTesting,
          },
          { provide: GoogleTracking, useClass: GoogleTrackingTesting },
          {
            provide: FacebookPixelTracking,
            useClass: FacebookPixelTrackingTesting,
          },
        ]
      : [],
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: CAPTCHA_CONFIG, useValue: environment.captchaConfig },
    {
      provide: COOKIE_OPTIONS,
      deps: [PLATFORM_ID, Location],
      useFactory: cookieOptionsFactory,
    },
    { provide: SITE_NAME, useValue: environment.siteName },
    // tslint:disable-next-line:deprecation FIXME: T106089
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
    { provide: SEO_CONFIG, useValue: environment.seoConfig },
    { provide: APPS_DOMAINS_MAP, useValue: environment.appsDomainsMap },
    { provide: ENVIRONMENT_NAME, useValue: environment.environmentName },
    { provide: APP_NAME, useValue: environment.appName },
    {
      provide: FREELANCER_HTTP_CONFIG,
      useValue: environment.freelancerHttpConfig,
    },
    { provide: FREELANCER_HTTP_AUTH_PROVIDERS, useExisting: Auth, multi: true },
    {
      provide: FREELANCER_HTTP_ABTEST_OVERRIDES_PROVIDER,
      useExisting: ABTestOverrides,
    },
    {
      provide: FREELANCER_LOCATION_AUTH_PROVIDER,
      useExisting: Auth,
    },
    {
      provide: FREELANCER_LOCATION_HTTP_BASE_URL_PROVIDER,
      useValue: environment.freelancerHttpConfig.baseUrl,
    },
    {
      provide: FREELANCER_LOCATION_PWA_PROVIDER,
      useExisting: Pwa,
    },
    {
      provide: FREELANCER_PWA_TRACKING_PROVIDER,
      useExisting: Tracking,
    },
    { provide: ABTEST_WHITELIST_COOKIE, useValue: environment.whitelistCookie },
    {
      provide: ARROW_LOGIN_SIGNUP_MARKETING_CONFIG,
      useValue: environment.arrowLoginSignupMarketingConfig,
    },
    { provide: FACEBOOK_CONFIG, useValue: environment.facebookConfig },
    { provide: LANGUAGE_COOKIE, useValue: environment.languageCookie },
    { provide: LOGIN_CONFIG, useValue: environment.loginConfig },
    BackgroundGeolocation,
  ],
  exports: [BrowserModule, ModalModule, TrackingModule, UiModule],
})
export class AppCommonModule {}
