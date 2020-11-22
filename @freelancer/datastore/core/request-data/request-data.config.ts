import { InjectionToken } from '@angular/core';
import { RequestDataConfig } from './request-data.interface';

export type RequestDataOptions =
  | Partial<RequestDataConfig>
  | (() => Partial<RequestDataConfig>);

export const REQUEST_DATA_CONFIG = new InjectionToken<RequestDataConfig>(
  'RequestData Configuration',
);
export const REQUEST_DATA_INITIAL_CONFIG = new InjectionToken<
  RequestDataOptions
>('RequestData Initial Options');
