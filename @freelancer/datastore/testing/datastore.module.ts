import { isPlatformBrowser } from '@angular/common';
import {
  APP_INITIALIZER,
  ModuleWithProviders,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import { AuthServiceInterface } from '@freelancer/auth';
import {
  Datastore,
  RequestStatusHandler,
  WebSocketService,
} from '@freelancer/datastore/core';
import { LOGIN_AUTH_SERVICE } from '@freelancer/login';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BackendFakeModule } from './backend';
import { DatastoreFake } from './datastore';
import { DatastoreTestingController } from './datastore-testing-controller';
import { DatastoreFakeConfig, DATASTORE_FAKE_CONFIG } from './datastore.config';
import { publishGlobalUtils } from './global-utils';
import { WebSocketServiceFake } from './websocket';

function initializeDatastoreFake(
  config: DatastoreFakeConfig,
  datastore: DatastoreFake,
  auth: AuthServiceInterface,
  platformId: string,
) {
  return () => {
    if (isPlatformBrowser(platformId)) {
      publishGlobalUtils(auth, datastore, config);
    }
    return config.initializer
      ? config.initializer(auth, datastore, datastore)
      : undefined;
  };
}

@NgModule({
  imports: [
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    BackendFakeModule.forRoot(),
  ],
  providers: [
    RequestStatusHandler,
    DatastoreFake,
    { provide: Datastore, useExisting: DatastoreFake },
    { provide: DatastoreTestingController, useExisting: DatastoreFake },
    { provide: WebSocketService, useClass: WebSocketServiceFake },
  ],
})
export class DatastoreFakeModule {
  static initialize(
    config: DatastoreFakeConfig,
  ): ModuleWithProviders<DatastoreFakeModule> {
    return {
      ngModule: DatastoreFakeModule,
      providers: [
        {
          provide: DATASTORE_FAKE_CONFIG,
          useValue: config,
        },
        config.initializer
          ? {
              // Initialise store state on application bootstrap so route guards
              // have access to datastore
              provide: APP_INITIALIZER,
              useFactory: initializeDatastoreFake,
              deps: [
                DATASTORE_FAKE_CONFIG,
                DatastoreFake,
                LOGIN_AUTH_SERVICE,
                PLATFORM_ID,
              ],
              multi: true,
            }
          : [],
      ],
    };
  }
}
