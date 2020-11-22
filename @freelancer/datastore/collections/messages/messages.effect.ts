import { Injectable } from '@angular/core';
import { Auth } from '@freelancer/auth';
import {
  isWebsocketAction,
  Path,
  pluckDocumentFromRawStoreCollectionState,
  StoreState,
  TypedAction,
  WebsocketActionPayload,
  WebsocketNewMessageEvent,
} from '@freelancer/datastore/core';
import { MessagingChat } from '@freelancer/messaging-chat';
import { isDefined, toNumber } from '@freelancer/utils';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { ThreadsCollection } from '../threads/threads.types';

/**
 * This effect makes sure we always fetch a thread if we receive a message on one that isn't in the datastore
 * - If we're on a page with chat, we `startChat`, which will do a threads query
 * - If we're not (eg. we're in the inbox or on mobile), we REQUEST_DATA for that thread.
 */
@Injectable()
export class MessagesEffect {
  @Effect()
  readonly fetchData$ = this.actions$.pipe(
    filter(isWebsocketAction),
    map(action => action.payload),
    filter(isMessagesPrivatePayload),
    withLatestFrom(this.store$, this.auth.authState$),
    filter(
      // only if authenticated
      ([auth]) => !!auth,
    ),
    map(([wsMessage, state, auth]) => {
      if (
        auth &&
        wsMessage.data.notify_user &&
        wsMessage.data.from_user !== toNumber(auth.userId) &&
        this.messagingChat.canStartChat()
      ) {
        // try to open the chatbox with the new message if the live chat is
        // loaded
        this.messagingChat.startChat({
          userIds: wsMessage.data.thread_details.members,
          threadType: wsMessage.data.thread_details.thread_type,
          origin: 'websocket',
          // FIXME (any): ContextTypeApi is an enum, and ThreadContextType is a
          // string union. Is there a way to convert one to the other?
          context: wsMessage.data.thread_details.context as any,
          threadId: wsMessage.data.thread_id,
          focus: false,
          doNotRedirect: true,
        });
        return undefined;
      }
      // otherwise fetch the thread if it isn't in the store
      const path: Path<ThreadsCollection> = {
        collection: 'threads',
        authUid: wsMessage.toUserId,
        ids: [String(wsMessage.data.thread_id)],
      };
      const thread = pluckDocumentFromRawStoreCollectionState(
        state.threads,
        path,
        wsMessage.data.thread_id,
      );
      if (!thread) {
        const action: TypedAction = {
          type: 'REQUEST_DATA',
          payload: {
            type: 'threads',
            ref: { path },
            clientRequestIds: [], // TODO: handle errors
          },
        };
        return action;
      }
      return undefined;
    }),
    filter(isDefined),
  );

  constructor(
    private actions$: Actions<TypedAction>,
    private auth: Auth,
    private store$: Store<StoreState>,
    private messagingChat: MessagingChat,
  ) {}
}

function isMessagesPrivatePayload(
  p: WebsocketActionPayload,
): p is WebsocketNewMessageEvent & { readonly toUserId: string } {
  return p.type === 'private' && p.parent_type === 'messages';
}
