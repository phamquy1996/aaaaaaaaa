import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import * as Rx from 'rxjs';
import { RetryRequestsConfig } from './operators/retryRequests';
import {
  RequestDataOptions,
  REQUEST_DATA_CONFIG,
  REQUEST_DATA_INITIAL_CONFIG,
} from './request-data.config';
import { RequestDataEffect } from './request-data.effect';
import { RequestDataConfig } from './request-data.interface';

const DEFAULT_DEDUPE_WINDOW = 10_000;
const DEFAULT_BATCH_WINDOW = 250;
const DEFAULT_RETRY_CONFIG: RetryRequestsConfig = {
  initialInterval: 200,
  maxRetries: 2,
  intervalFn: (i, initialInterval) => initialInterval * 2 ** i,
};

export function createConfig(_options: RequestDataOptions): RequestDataConfig {
  const DEFAULT_OPTIONS: RequestDataConfig = {
    scheduler: Rx.asyncScheduler,
    dedupeWindowTime: DEFAULT_DEDUPE_WINDOW,
    batchWindowTime: DEFAULT_BATCH_WINDOW,
    retryConfig: DEFAULT_RETRY_CONFIG,
  };

  const options = typeof _options === 'function' ? _options() : _options;
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (config.dedupeWindowTime < 0) {
    throw new Error(
      `RequestData dedupe window must be non-negative, got ${config.dedupeWindowTime}`,
    );
  }

  if (config.batchWindowTime < 0) {
    throw new Error(
      `RequestData batch window must be non-negative, got ${config.batchWindowTime}`,
    );
  }

  return config;
}

@NgModule({
  imports: [EffectsModule.forFeature([RequestDataEffect])],
})
export class RequestDataModule {
  static initialize(): ModuleWithProviders<RequestDataModule> {
    return {
      ngModule: RequestDataModule,
      providers: [
        {
          provide: REQUEST_DATA_CONFIG,
          deps: [REQUEST_DATA_INITIAL_CONFIG],
          useFactory: createConfig,
        },
      ],
    };
  }
}
