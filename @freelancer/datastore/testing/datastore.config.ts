import { InjectionToken } from '@angular/core';
import { AuthServiceInterface } from '@freelancer/auth';
import { DatastoreInterface } from '@freelancer/datastore/core';
import { DatastoreTestingController } from './datastore-testing-controller';

export type DatastoreInitializer = (
  auth: AuthServiceInterface,
  datastore: DatastoreInterface,
  datastoreController: DatastoreTestingController,
) => Promise<void>;

export interface DatastoreFakeConfig {
  readonly debug: boolean;
  readonly initializer?: DatastoreInitializer;
  readonly documentCreators?: object; // An ES6 module
}

export const DATASTORE_FAKE_CONFIG = new InjectionToken<DatastoreFakeConfig>(
  'DatastoreFake Configuration',
);
