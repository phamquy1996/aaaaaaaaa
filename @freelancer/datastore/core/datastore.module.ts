import { isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ErrorTracking, PerformanceTracking } from '@freelancer/tracking';
import { IonicStorageModule } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import {
  MetaReducer,
  StoreModule,
  USER_PROVIDED_META_REDUCERS,
} from '@ngrx/store';
import { environment } from 'environments/environment';
import { TypedAction } from './actions';
import { ApiHttp } from './api-http.service';
import { BackendModule } from './backend';
import { Datastore } from './datastore';
import { DATASTORE_CONFIG, HTTP_ADAPTER } from './datastore.config';
import { DatastoreConfig } from './datastore.interface';
import { errorHandlerReducerFactory } from './error-handler.reducer';
import { datastoreHydrationReducerFactory } from './local-cache/datastore-hydration.reducer';
import { LocalCacheModule } from './local-cache/local-cache.module';
import { REQUEST_DATA_INITIAL_CONFIG } from './request-data';
import { RequestDataModule } from './request-data/request-data.module';
import { RequestStatusHandler } from './request-status-handler.service';
import { stateTransferReducerFactory } from './state-transfer.reducer';

export function getMetaReducers(
  errorTracking: ErrorTracking,
  performanceTracking: PerformanceTracking,
  platformId: Object,
  transferState: TransferState,
): ReadonlyArray<MetaReducer<any, TypedAction>> {
  const metaReducers: MetaReducer<any, TypedAction>[] = [
    errorHandlerReducerFactory(errorTracking),
    stateTransferReducerFactory(transferState, platformId),
  ];
  // Store session cache is disabled in local dev
  if (
    isPlatformBrowser(platformId) &&
    window.location.hostname !== 'localhost' &&
    !window.location.hostname.startsWith('192.168.') &&
    !window.location.hostname.startsWith('10.')
  ) {
    metaReducers.push(datastoreHydrationReducerFactory());
  }
  return metaReducers;
}

@NgModule({
  imports: [
    HttpClientModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(
      {},
      // FIXME: Use an injection token once https://github.com/ngrx/platform/pull/2006 hits master
      {
        runtimeChecks: {
          strictStateImmutability:
            environment.datastoreConfig.enableStoreFreeze,
          strictActionImmutability:
            environment.datastoreConfig.enableStoreFreeze,
        },
      },
    ),
    EffectsModule.forRoot([]),
    LocalCacheModule,
    RequestDataModule.initialize(),
    BackendModule.forRoot(),
  ],
  providers: [ApiHttp, RequestStatusHandler],
})
export class DatastoreModule {
  static initialize(
    config: DatastoreConfig,
  ): ModuleWithProviders<DatastoreModule> {
    return {
      ngModule: DatastoreModule,
      providers: [
        Datastore,
        {
          provide: DATASTORE_CONFIG,
          useValue: config,
        },
        {
          provide: USER_PROVIDED_META_REDUCERS,
          deps: [
            ErrorTracking,
            PerformanceTracking,
            PLATFORM_ID,
            TransferState,
          ],
          useFactory: getMetaReducers,
        },
        {
          provide: HTTP_ADAPTER,
          useClass: config.httpAdapter,
        },
        {
          provide: REQUEST_DATA_INITIAL_CONFIG,
          useValue: config.requestData,
        },
      ],
    };
  }
}
