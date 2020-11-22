import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Auth } from '@freelancer/auth';
import * as djv from 'djv';
import * as Rx from 'rxjs';
import {
  distinctUntilChanged,
  map,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs/operators';
import { definitions, topLevelSchemas } from './json-schemas';
import { LocalStorageTypes } from './local-storage.model';
/**
 * LOCAL STORAGE API:
 *
 * Use Cases of `undefined` and `null`:
 * When an observable for an item is created, if the item does not exist yet,
 * then `undefined` is initially emitted, indicating 'no value set yet'.
 * Since items in localStorage must be JSON serialisable, we can use `null` to indicate
 * when an item has been removed from localStorage.
 * These items will still have meta-information and are treated like any other item.
 *
 */

/**
 * The meta-object for storing into local storage.
 */
export interface LocalStorageMetaObject<T extends keyof LocalStorageTypes> {
  readonly timeCreated: number;
  readonly timeUpdated: number;
  readonly lastReadTime: number;
  // TTL?: number;
  readonly item: LocalStorageTypes[T];
}

/**
 * A map of the local storage objects indexed by the authenticated user who created them.
 */
export interface LocalStorageEntry<T extends keyof LocalStorageTypes> {
  readonly [authId: string]: LocalStorageMetaObject<T>;
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  private subjects: {
    [key in keyof LocalStorageTypes]: {
      [authId: string]: Rx.BehaviorSubject<LocalStorageTypes[key] | undefined>;
    };
  };
  private authId$: Rx.Observable<string>;
  private authId: string;
  private readonly env = djv();
  private readonly LOGGED_OUT_KEY = 'logged-out';
  private isInitialized = false;

  constructor(
    private auth: Auth,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /*
   * Initialisation only occurs when the functions are being called,
   * allowing for no side effects during injection
   * http://misko.hevery.com/code-reviewers-guide/flaw-constructor-does-real-work/
   */
  private init(): void {
    this.subjects = {
      arrowPostProjectDraft: {},
      contestShowSocialShareBanner: {},
      dashboardMyProjectsUserType: {},
      developersPreference: {},
      deviceId: {},
      enterpriseContactFormSubmitted: {},
      hideEnablePushNotificationsBanner: {},
      hideMobileNewMessageToast: {},
      hireMeDraft: {},
      inviteToBidDiscardedFreelancers: {},
      lastSeenPjpAssistant: {},
      manageRecentTable: {},
      navUpdatesLastReadTime: {},
      postJobPageDraft: {},
      postProjectObject: {},
      projectOverlayFullFlowComplete: {},
      projectOverlayThreadComplete: {},
      taskList: {},
      taskListCurrentTaskClean: {},
      testName: {},
      testProfile: {},
      testProperty: {},
      webappChatDraftMessages: {},
      webappChats: {},
      webappThreadListMinimise: {},
    };

    this.authId$ = this.auth.authState$.pipe(
      map(authState =>
        authState ? `id-${authState.userId}` : this.LOGGED_OUT_KEY,
      ),
      publishReplay(1),
      refCount(),
    );

    this.authId$.subscribe(id => {
      this.authId = id;
    });

    this.env.addSchema('defs.json', definitions);

    /*
      This event will only be fired in tabs other than the current one.
      See https://www.w3.org/TR/webstorage/#the-localstorage-attribute

      If other tabs have an observable of the changed item, the observable will emit the change.
    */

    window.addEventListener(
      'storage',
      <T extends keyof LocalStorageTypes>(e: StorageEvent): void => {
        if (!e.key || !this.isValidLocalStorageType(e.key)) {
          return;
        }

        const subject = this.subjects[e.key];
        if (subject && subject[this.authId]) {
          let newObject: LocalStorageEntry<T>;
          try {
            newObject = JSON.parse(e.newValue || '{}');
          } catch (err) {
            return;
          }

          subject[this.authId].next(
            // there's no way to know what type `subject` expects so we have to use `any` here
            newObject[this.authId] && (newObject[this.authId].item as any),
          );
        }
      },
    );

    this.isInitialized = true;
  }

  /**
   * Returns an OBSERVABLE of the current item under `key` for the current authId
   * or under the `loggedOutKey` if `loggedOutMode` is true.
   */
  get<T extends keyof LocalStorageTypes>(
    key: T,
    loggedOutMode?: boolean,
  ): Rx.Observable<LocalStorageTypes[T] | undefined> {
    if (!isPlatformBrowser(this.platformId)) {
      return Rx.of(undefined);
    }

    if (!this.isInitialized) {
      this.init();
    }

    return this.authId$.pipe(
      switchMap(authId => {
        const authKey = loggedOutMode ? this.LOGGED_OUT_KEY : authId;
        const entryObj = getEntryObject(key, authKey);

        if (!entryObj) {
          // parsing error occured
          return Rx.of(undefined);
        }

        // item obtained does not conform to allowed LocalStorageTypes
        if (entryObj[authId] && !this.isValidItem(key, entryObj[authId].item)) {
          return Rx.of(undefined);
        }

        // typescript can't tell that `key` indexes into `LocalStorageTypes[T]` for some reason,
        // so we have to cast with `any` because it would otherwise treat it as a union of all possible subjectMaps
        const subjectMap: {
          [authUid: string]: Rx.BehaviorSubject<
            LocalStorageTypes[T] | undefined
          >;
        } = this.subjects[key] as any;
        if (!subjectMap[authKey]) {
          subjectMap[authKey] = new Rx.BehaviorSubject(
            entryObj[authKey] ? entryObj[authKey].item : undefined, // if object has never been set in local storage, emit undefined.
          );
        }

        return subjectMap[authKey].asObservable().pipe(distinctUntilChanged());
      }),
    );
  }

  /**
   * Stores `item` in local storage for `key` under the current authId
   * or under the `loggedOutKey` if `loggedOutMode` is true.
   * If there is a subject for that particular entry, notify the observers (of that subject) of the change.
   */
  set<T extends keyof LocalStorageTypes>(
    key: T,
    item: LocalStorageTypes[T],
    loggedOutMode?: boolean,
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.isInitialized) {
      this.init();
    }
    const authKey = loggedOutMode ? this.LOGGED_OUT_KEY : this.authId;
    setRaw(key, authKey, item);

    if (this.subjects[key][authKey]) {
      // we have to cast here because typescript can't quite deduce that indexing T into `subjects`
      // results in a BehaviorSubject<LocalStorageTypes[T]>, and it thinks it's a union
      const subject$ = this.subjects[key][authKey] as Rx.BehaviorSubject<
        LocalStorageTypes[T] | undefined
      >;
      if (subject$) {
        subject$.next(item);
      }
    }
  }

  /**
   * Checks whether the item is valid against the JSON Schema.
   */
  private isValidItem<T extends keyof LocalStorageTypes>(
    key: T,
    item: any,
  ): boolean {
    this.env.addSchema(key, topLevelSchemas[key]);
    if (this.env.validate(key, item)) {
      console.warn(
        `Failed to load ${key} from local storage as its format has changed. Check that it still validates against the schema at 'local-storage/json-schemas.ts'`,
      );
      return false;
    }
    return true;
  }

  private isValidLocalStorageType(key: string): key is keyof LocalStorageTypes {
    return key in this.subjects;
  }
}

/* HELPER FUNCTIONS */
/**
 * Directly store a @param item for a given @param authId.
 */
function setRaw<T extends keyof LocalStorageTypes>(
  key: T,
  authId: string,
  item: LocalStorageTypes[T],
): void {
  const entryObj = getEntryObject(key, authId, false);

  if (!entryObj) {
    // parsing error occurred.
    return;
  }

  const currentTime = Date.now();

  const addItem = entryObj[authId]
    ? {
        ...entryObj[authId],
        timeUpdated: currentTime,
        item,
      }
    : {
        timeUpdated: currentTime,
        timeCreated: currentTime,
        lastReadTime: currentTime,
        item,
      };

  const newEntryObj = {
    ...entryObj,
    [authId]: addItem,
  };
  try {
    // if doesn't exist, creates, otherwise overrides.
    window.localStorage.setItem(key, JSON.stringify(newEntryObj));
  } catch (e) {
    // Do nothing
  }
}

/**
 * Turns the string when you first index into local storage (via `key`)
 * into a JSON object and updates `lastReadTime` for the particular `authId`.
 */
function getEntryObject<T extends keyof LocalStorageTypes>(
  key: T,
  authId: string,
  markAsRead = true,
): LocalStorageEntry<T> | null {
  let entryObj: LocalStorageEntry<T>;

  try {
    entryObj = JSON.parse(window.localStorage.getItem(key) || '{}');
  } catch (e) {
    return null;
  }
  // update `lastReadTime`
  if (entryObj[authId] && markAsRead) {
    const newEntryObj = {
      ...entryObj,
      [authId]: {
        ...entryObj[authId],
        lastReadTime: Date.now(),
      },
    };
    try {
      window.localStorage.setItem(key, JSON.stringify(newEntryObj));
    } catch (e) {
      return null;
    }
  }

  return entryObj;
}
