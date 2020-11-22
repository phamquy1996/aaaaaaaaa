import { ErrorTracking } from '@freelancer/tracking';
import { TypedAction } from './actions';

export function errorHandlerReducerFactory(errorTracking: ErrorTracking) {
  return (reducer: any) => (state: any, action: TypedAction) => {
    let nextState = state;
    try {
      nextState = reducer(state, action);
    } catch (e) {
      console.error('REDUCER ERROR: ', e);
      console.error('Broken state & action: ', state, action);
      errorTracking.captureException(e, {
        extra: { action },
      });
    }
    return nextState;
  };
}
