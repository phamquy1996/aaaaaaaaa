import {
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  mergeWebsocketDocuments,
  transformIntoDocuments,
  updateWebsocketDocuments,
} from '@freelancer/datastore/core';
import {
  EscrowComLinkConsentResultApi,
  MarketingMobileNumberResultApi,
  UserApi,
} from 'api-typings/users/users';
import {
  mergeUpdateSuccessResult,
  transformMarketingMobileNumberAPIResult,
  transformUsersSelf,
} from './users-self.transformers';
import { UsersSelfCollection } from './users-self.types';

// The type guard is needed as this collection's update function
// hits two different endpoints depending on the delta
function isEscrowComLinkConsentResult(
  result:
    | UserApi
    | EscrowComLinkConsentResultApi
    | MarketingMobileNumberResultApi,
): result is EscrowComLinkConsentResultApi {
  return 'user' in result;
}

/**
 * This works only because we don't set projections on user's updates
 * and so this field will be missing.
 */
function isMarketingMobileNumberResult(
  result:
    | UserApi
    | EscrowComLinkConsentResultApi
    | MarketingMobileNumberResultApi,
): result is MarketingMobileNumberResultApi {
  return 'marketing_mobile_number' in result;
}

export function usersSelfReducer(
  state: CollectionStateSlice<UsersSelfCollection> = {},
  action: CollectionActions<UsersSelfCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS': {
      if (action.payload.type === 'usersSelf') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<UsersSelfCollection>(
          state,
          transformIntoDocuments([result], transformUsersSelf),
          order,
          ref,
        );
      }
      return state;
    }

    case 'API_UPDATE_SUCCESS': {
      if (action.payload.type === 'usersSelf') {
        const { result, ref, originalDocument } = action.payload;

        if (result && isMarketingMobileNumberResult(result)) {
          return mergeWebsocketDocuments<UsersSelfCollection>(
            state,
            transformIntoDocuments(
              [result],
              transformMarketingMobileNumberAPIResult,
              originalDocument,
            ),
            ref,
          );
        }

        const usersArray =
          result && isEscrowComLinkConsentResult(result)
            ? [result.user]
            : [result];
        return mergeWebsocketDocuments<UsersSelfCollection>(
          state,
          transformIntoDocuments(
            usersArray,
            mergeUpdateSuccessResult,
            originalDocument,
          ),
          ref,
        );
      }

      return state;
    }

    case 'WS_MESSAGE': {
      const userId = action.payload.toUserId;
      const ref = {
        path: { collection: 'usersSelf', authUid: userId },
      };
      if (action.payload.type === 'emailVerified') {
        return updateWebsocketDocuments<UsersSelfCollection>(
          state,
          [userId],
          usersSelf =>
            deepSpread(usersSelf, {
              status: { emailVerified: true },
            }),
          ref,
        );
      }

      if (action.payload.type === 'emailChangeConfirmed') {
        return updateWebsocketDocuments<UsersSelfCollection>(
          state,
          [userId],
          usersSelf => ({
            ...usersSelf,
            email: action.payload.data.newEmail,
          }),
          ref,
        );
      }

      return state;
    }
    default:
      return state;
  }
}
