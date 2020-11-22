import { AuthServiceInterface } from '@freelancer/auth';
import { DatastoreInterface, LOGGED_OUT_KEY } from '@freelancer/datastore/core';
import { DatastoreTestingController } from '@freelancer/datastore/testing';
import { toNumber } from '@freelancer/utils';
import { map, take } from 'rxjs/operators';
import {
  printDatastoreState,
  setAuth,
  setDatastoreController,
} from './document-creators';
import { constructInitialStoreState } from './initial-state';
import { addPushTransformers } from './push-transformers';

export function datastoreInitializer(
  { isTesting } = { isTesting: false },
): (
  auth: AuthServiceInterface,
  datastore: DatastoreInterface,
  datastoreController: DatastoreTestingController,
) => Promise<void> {
  return (
    auth: AuthServiceInterface,
    datastore: DatastoreInterface,
    datastoreController: DatastoreTestingController,
  ) => {
    setAuth(auth);
    setDatastoreController(datastoreController);

    // Initialise datastore as a logged-in user for fake dev only
    // In UI tests, we need to cover both logged-in and logged-out flows, so
    // the test logs in if needed
    if (!isTesting) {
      auth.setSession('1', '');
    }

    return auth.authState$
      .pipe(
        take(1),
        map(authState =>
          toNumber(authState ? authState.userId : LOGGED_OUT_KEY),
        ),
      )
      .toPromise()
      .then(authUid => {
        addPushTransformers(authUid);

        if (!isTesting) {
          constructInitialStoreState(auth, datastore, authUid);
          printDatastoreState();
        }
      })
      .catch(err => console.error('Failed to initialize datastore:', err));
  };
}
