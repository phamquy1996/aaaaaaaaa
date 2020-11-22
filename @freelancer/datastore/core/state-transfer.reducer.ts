import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActionReducer } from '@ngrx/store';
import { TypedAction } from './actions';

export const NGRX_STATE = makeStateKey('NGRX_STATE');

export function stateTransferReducerFactory(
  transferState: TransferState,
  platformId: Object,
) {
  // if on the server, register the transferState.onSerialize listener & pass
  // in the last state on serialization
  let saveState: any;
  if (isPlatformServer(platformId)) {
    transferState.onSerialize(NGRX_STATE, () => saveState);
  }

  return (reducer: ActionReducer<any, TypedAction>) => (
    state: any,
    action: TypedAction,
  ) => {
    let nextState = state;
    // if on the client & a state has been stored, load it
    const hasState = transferState.hasKey<any>(NGRX_STATE);
    if (isPlatformBrowser(platformId) && hasState) {
      const transferedState = transferState.get<any>(NGRX_STATE, null);
      transferState.remove(NGRX_STATE);
      nextState = {
        ...state,
        ...transferedState,
      };
    }
    saveState = reducer(nextState, action);
    return saveState;
  };
}
