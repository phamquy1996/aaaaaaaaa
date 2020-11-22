import { InjectionToken } from '@angular/core';
import { DatastoreConfig, HttpAdapter } from './datastore.interface';

export const DATASTORE_CONFIG = new InjectionToken<DatastoreConfig>(
  'Datastore Configuration',
);

export const HTTP_ADAPTER = new InjectionToken<HttpAdapter>('HttpAdapter');
