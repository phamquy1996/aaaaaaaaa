import { ActionReducer } from '@ngrx/store';
import { TypedAction } from '../actions';
import { StoreState } from '../store.model';
import { mergeUserCollectionStateSlice } from './local-cache.helpers';

/**
 * Handle the LOCAL_CACHE_FETCH_SUCCESS action to hydrate the
 * datastore with the locally cached value. This happens right
 * after REQUEST_DATA and probably before API_FETCH_SUCCESS
 * because cache hit is usually faster than API response.
 */
export function datastoreHydrationReducerFactory() {
  return (reducer: ActionReducer<unknown, TypedAction>) => (
    state: StoreState,
    action: TypedAction,
  ) => {
    if (action.type === 'LOCAL_CACHE_FETCH_SUCCESS') {
      // Hydrate the datastore with the cached state.
      const {
        ref: {
          path: { collection, authUid },
        },
        cachedState: userStateSliceInCache,
      } = action.payload;

      // Combine the user collection state slice into
      // the datastore state to form a new state.
      const nextState = {
        ...state,
        [collection]: {
          ...state[collection],
          // Add new documents or queries into the store. In case
          // of an older version of document or query in the cache,
          // ensure the newer version supersedes the older version.
          [authUid]: mergeUserCollectionStateSlice(
            state[collection]?.[authUid],
            userStateSliceInCache,
          ),
        },
      };

      return reducer(nextState, action);
    }
    return reducer(state, action);
  };
}
