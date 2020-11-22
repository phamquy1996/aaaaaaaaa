import { AuthState } from '@freelancer/auth';
import { isWebsocketMessage, WebSocketService } from '@freelancer/datastore';
import { isDefined } from '@freelancer/utils';
import { CallType } from '@freelancer/videochat';
import * as Rx from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';

export interface CallEvent {
  type: CallType;
  otherMembers: ReadonlyArray<number>;
  threadId: number;
  makingCall: boolean;
}

export function websocketListener(
  webSocketService: WebSocketService,
  authState$: Rx.Observable<AuthState | undefined>,
  makingCall$: Rx.Observable<boolean>,
): Rx.Observable<CallEvent | undefined> {
  return webSocketService.fromServerStream$.pipe(
    filter(isWebsocketMessage),
    withLatestFrom(authState$.pipe(filter(isDefined)), makingCall$),
    filter(
      ([wsm, authState, makingCall]) => wsm.body.parent_type === 'messages',
    ),
    map(([wsm, authState, makingCall]) => {
      const { body } = wsm;
      const userId = Number(authState.userId);
      if (body.parent_type === 'messages' && 'thread_id' in body.data) {
        const otherMembers = body.targets.filter(u => u !== userId);
        const threadId = body.data.thread_id;
        switch (body.type) {
          case 'video:request':
            if (body.data.user_id !== userId && !makingCall) {
              return {
                type: CallType.VIDEO,
                otherMembers,
                threadId,
                makingCall: false,
              };
            }
            break;
          case 'video:request:audio_only':
            if (body.data.user_id !== userId && !makingCall) {
              return {
                type: CallType.AUDIO,
                otherMembers,
                threadId,
                makingCall: false,
              };
            }
            break;
          case 'video:close':
          case 'video:reject':
            return {
              type: CallType.NONE,
              otherMembers,
              threadId,
              makingCall: false,
            };
          case 'video:accept':
            return {
              type: CallType.NONE,
              otherMembers,
              threadId,
              makingCall: true,
            };
          default:
            // TODO Would be ideal to have this be an exhaustive pattern match.
            break;
        }
      }
    }),
  );
}
