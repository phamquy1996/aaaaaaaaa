import { RecursivePartial } from './helpers';
import { Ordering } from './query';
import {
  DatastoreCollectionType,
  DatastoreDeleteCollectionType,
  DatastoreFetchCollectionType,
  DatastorePushCollectionType,
  DatastoreSetCollectionType,
  DatastoreUpdateCollectionType,
  PushDocumentType,
  Reference,
  SetDocumentType,
  UserCollectionStateSlice,
} from './store.model';
import { WebsocketEvent } from './websocket';

export interface FetchSuccessAction<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> {
  readonly type: 'API_FETCH_SUCCESS';
  readonly payload: FetchSuccessPayload<C>;
}

export interface FetchErrorAction<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> {
  readonly type: 'API_FETCH_ERROR';
  readonly payload: FetchErrorPayload<C>;
}

export interface PushAction<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> {
  readonly type: 'API_PUSH';
  readonly payload: PushRequestPayload<C>;
}

export interface PushSuccessAction<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> {
  readonly type: 'API_PUSH_SUCCESS';
  readonly payload: PushSuccessPayload<C>;
}

export interface PushErrorAction<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> {
  readonly type: 'API_PUSH_ERROR';
  readonly payload: PushErrorPayload<C>;
}

export interface SetAction<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> {
  readonly type: 'API_SET';
  readonly payload: SetRequestPayload<C>;
}

export interface SetSuccessAction<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> {
  readonly type: 'API_SET_SUCCESS';
  readonly payload: SetSuccessPayload<C>;
}

export interface SetErrorAction<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> {
  readonly type: 'API_SET_ERROR';
  readonly payload: SetErrorPayload<C>;
}

export interface UpdateAction<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> {
  readonly type: 'API_UPDATE';
  readonly payload: UpdateRequestPayload<C>;
}

export interface UpdateSuccessAction<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> {
  readonly type: 'API_UPDATE_SUCCESS';
  readonly payload: UpdateSuccessPayload<C>;
}

export interface UpdateErrorAction<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> {
  readonly type: 'API_UPDATE_ERROR';
  readonly payload: UpdateErrorPayload<C>;
}

export interface DeleteAction<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> {
  readonly type: 'API_DELETE';
  readonly payload: DeleteRequestPayload<C>;
}

export interface DeleteSuccessAction<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> {
  readonly type: 'API_DELETE_SUCCESS';
  readonly payload: DeleteSuccessPayload<C>;
}

export interface DeleteErrorAction<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> {
  readonly type: 'API_DELETE_ERROR';
  readonly payload: DeleteErrorPayload<C>;
}

export interface RequestDataAction<C extends DatastoreCollectionType> {
  readonly type: 'REQUEST_DATA';
  readonly payload: RequestDataPayload<C>;
}

export interface WsMessageAction {
  readonly type: 'WS_MESSAGE';
  readonly no_persist: boolean;
  readonly payload: WebsocketActionPayload;
}

export interface LocalCacheFetchSuccessAction<
  C extends DatastoreCollectionType
> {
  readonly type: 'LOCAL_CACHE_FETCH_SUCCESS';
  readonly payload: LocalCacheFetchSuccessPayload<C>;
}

/**
 * List of actions corresponding to the root model.
 * Note: this is an extension of @ngrx/store's Action.
 */
export type CollectionActions<C extends DatastoreCollectionType> =
  // | { type: 'API_FETCH'; payload: FetchRequestPayload<T> }
  | (C extends DatastoreFetchCollectionType ? FetchSuccessAction<C> : never)
  | (C extends DatastoreFetchCollectionType ? FetchErrorAction<C> : never)
  | (C extends DatastorePushCollectionType ? PushAction<C> : never)
  | (C extends DatastorePushCollectionType ? PushSuccessAction<C> : never)
  | (C extends DatastorePushCollectionType ? PushErrorAction<C> : never)
  | (C extends DatastoreSetCollectionType ? SetAction<C> : never)
  | (C extends DatastoreSetCollectionType ? SetSuccessAction<C> : never)
  | (C extends DatastoreSetCollectionType ? SetErrorAction<C> : never)
  | (C extends DatastoreUpdateCollectionType ? UpdateAction<C> : never)
  | (C extends DatastoreUpdateCollectionType ? UpdateSuccessAction<C> : never)
  | (C extends DatastoreUpdateCollectionType ? UpdateErrorAction<C> : never)
  | (C extends DatastoreDeleteCollectionType ? DeleteAction<C> : never)
  | (C extends DatastoreDeleteCollectionType ? DeleteSuccessAction<C> : never)
  | (C extends DatastoreDeleteCollectionType ? DeleteErrorAction<C> : never)
  | RequestDataAction<C>
  | WsMessageAction
  | LocalCacheFetchSuccessAction<C>;

/**
 * List of actions for every root model.
 */
export type TypedAction = CollectionActions<any>;

interface BasePayload<C extends DatastoreCollectionType> {
  readonly type: C['Name']; // While this is in the ref, this helps TypeScript do the discriminated union
  readonly ref: Reference<C>;
  readonly resourceGroup?: C['ResourceGroup'];
}

/****************************************
 *  Fetch                               *
 ****************************************/
interface FetchSuccessPayload<
  C extends DatastoreCollectionType & DatastoreFetchCollectionType
> extends BasePayload<C> {
  readonly result: C['Backend']['Fetch']['ReturnType'];
  readonly order: Ordering<C>;
  readonly clientRequestIds: ReadonlyArray<string>;
}

interface FetchErrorPayload<C extends DatastoreCollectionType>
  extends BasePayload<C> {
  readonly order: Ordering<C>;
  readonly clientRequestIds: ReadonlyArray<string>;
}

/****************************************
 *  Push                                *
 ****************************************/
export interface PushRequestPayload<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> extends BasePayload<C> {
  readonly document: PushDocumentType<C>;
  readonly rawRequest: C['Backend']['Push']['PayloadType'];
  readonly asFormData?: boolean;
}

export interface PushSuccessPayload<
  C extends DatastoreCollectionType & DatastorePushCollectionType
> extends BasePayload<C> {
  readonly document: PushDocumentType<C>;
  readonly rawRequest: C['Backend']['Push']['PayloadType'];
  readonly result: C['Backend']['Push']['ReturnType'];
}

type PushErrorPayload<C extends DatastoreCollectionType> = PushRequestPayload<
  C & DatastorePushCollectionType
>;

/****************************************
 *  Set                                 *
 ****************************************/

export interface SetRequestPayload<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> extends BasePayload<C> {
  readonly document: SetDocumentType<C>;
  readonly originalDocument?: SetDocumentType<C>;
  readonly rawRequest: C['Backend']['Set']['PayloadType']; //  FIXME Do I need method?
  readonly asFormData?: boolean;
}

interface SetSuccessPayload<
  C extends DatastoreCollectionType & DatastoreSetCollectionType
> extends BasePayload<C> {
  readonly document: SetDocumentType<C>;
  readonly originalDocument: SetDocumentType<C>;
  readonly rawRequest: C['Backend']['Set']['PayloadType']; //  FIXME Do I need method?
  readonly result: C['Backend']['Set']['ReturnType'];
}

type SetErrorPayload<C extends DatastoreCollectionType> = SetRequestPayload<
  C & DatastoreSetCollectionType
>;

/****************************************
 *  Update                                 *
 ****************************************/

export interface UpdateRequestPayload<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> extends BasePayload<C> {
  readonly delta: RecursivePartial<C['DocumentType']>;
  readonly originalDocument: C['DocumentType'];
  readonly rawRequest: C['Backend']['Update']['PayloadType']; //  FIXME Do I need method?
  readonly asFormData?: boolean;
}

interface UpdateSuccessPayload<
  C extends DatastoreCollectionType & DatastoreUpdateCollectionType
> extends BasePayload<C> {
  readonly delta: RecursivePartial<C['DocumentType']>;
  readonly originalDocument: C['DocumentType'];
  readonly rawRequest: C['Backend']['Update']['PayloadType']; //  FIXME Do I need method?
  readonly result: C['Backend']['Update']['ReturnType'];
}

type UpdateErrorPayload<
  C extends DatastoreCollectionType
> = UpdateRequestPayload<C & DatastoreUpdateCollectionType>;

/****************************************
 *  Delete                              *
 ****************************************/

export interface DeleteRequestPayload<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> extends BasePayload<C> {
  readonly originalDocument: C['DocumentType'];
  readonly rawRequest: C['Backend']['Delete']['PayloadType']; //  FIXME Do I need method?
  readonly asFormData?: boolean;
}

interface DeleteSuccessPayload<
  C extends DatastoreCollectionType & DatastoreDeleteCollectionType
> extends BasePayload<C> {
  readonly originalDocument: C['DocumentType'];
  readonly rawRequest: C['Backend']['Delete']['PayloadType']; //  FIXME Do I need method?
  readonly result: C['Backend']['Delete']['ReturnType'];
}

type DeleteErrorPayload<
  C extends DatastoreCollectionType
> = DeleteRequestPayload<C & DatastoreDeleteCollectionType>;

/****************************************
 *  Request data                        *
 ****************************************/

export interface RequestDataPayload<C extends DatastoreCollectionType>
  extends BasePayload<C> {
  readonly clientRequestIds: ReadonlyArray<string>;
}

/****************************************
 *  Websocket                           *
 ****************************************/

export type WebsocketActionPayload = WebsocketEvent & {
  readonly toUserId: string;
};

/****************************************
 *  Local Cache Fetch Success           *
 ****************************************/

export interface LocalCacheFetchSuccessPayload<
  C extends DatastoreCollectionType
> extends BasePayload<C> {
  readonly cachedState: UserCollectionStateSlice<C>;
}

/****************************************
 *  Type guards                         *
 ****************************************/

export function isRequestDataAction(
  a: TypedAction,
): a is {
  readonly type: 'REQUEST_DATA';
  readonly payload: RequestDataPayload<any>; // FIXME
} {
  return a.type === 'REQUEST_DATA';
}

export function isWebsocketAction(
  a: TypedAction,
): a is {
  readonly type: 'WS_MESSAGE';
  readonly no_persist: boolean;
  readonly payload: WebsocketActionPayload;
} {
  return a.type === 'WS_MESSAGE';
}

// Appends the collection key to an action's type in order to clarify what part
// of the store the action is affecting. In the case of a websocket message,
// this appends the type of the message.
// Used by @ngrx/store-devtools
export function datastoreActionSanitizer(
  action: TypedAction,
  id: number,
): { readonly type: string; readonly payload: object } {
  if (!action.payload) {
    return action;
  }

  const ids =
    action.type !== 'WS_MESSAGE' && action.payload.ref.path.ids
      ? action.payload.ref.path.ids.join(', ')
      : undefined;

  return {
    ...action,
    type: `${action.type} [${action.payload.type}] ${ids ? ` - ${ids}` : ''}`,
  };
}
