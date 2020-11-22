import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  mergeDocuments,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isTestEntry } from '../newsfeed/newsfeed.transformers';
import { transformWebsocketNotification } from '../notifications/notifications.transformers';
import { transformProjectFeedWS } from '../project-feed/project-feed.transformers';
import { ToastNotificationsCollection } from './toast-notifications.types';

export function toastNotificationsReducer(
  state: CollectionStateSlice<ToastNotificationsCollection> = {},
  action: CollectionActions<ToastNotificationsCollection>,
) {
  switch (action.type) {
    // This collection doesn't depend on an endpoint to hit first to populate
    // with `API_FETCH_SUCCESS` to `mergeDocuments` and add the list, so let's add
    // a new list based on the query at the `REQUEST_DATA` level.
    case 'REQUEST_DATA': {
      if (action.payload.type === 'toastNotifications') {
        const { ref } = action.payload;
        return mergeDocuments(
          state,
          [],
          [{ field: 'time', direction: OrderByDirection.DESC }],
          ref,
        );
      }

      return state;
    }
    case 'WS_MESSAGE':
      switch (action.payload.type) {
        case 'contest':
        case 'failingProject':
        case 'localJobPosted':
        case 'project':
        case 'recruiterProject':
        case 'xpContest': {
          if (isTestEntry(action.payload)) {
            return state;
          }

          return addWebsocketDocuments(
            state,
            [action.payload],
            transformProjectFeedWS,
            {
              path: {
                collection: 'toastNotifications',
                authUid: action.payload.toUserId,
              },
            },
          );
        }
        case 'award':
        case 'awardBadge':
        case 'awardCredit':
        case 'awardMilestoneReminder':
        case 'awardReminder':
        case 'awardXp':
        case 'bid':
        case 'completed':
        case 'contestAwardedToEmployer':
        case 'contestAwardedToFreelancer':
        case 'contestEntry':
        case 'contestEntryBoughtToEmployer':
        case 'contestEntryBoughtToFreelancer':
        case 'contestPCBNotification':
        case 'contestPCBNotificationFullView':
        case 'createMilestone':
        case 'denyed':
        case 'draftContest':
        case 'highLtvAnnualDiscount':
        case 'hireMe':
        case 'inviteToContest':
        case 'inviteUserBid':
        case 'invoiceRequested':
        case 'levelUp':
        case 'notifyfollower':
        case 'quickHireProject':
        case 'releaseMilestone':
        case 'requestEndProject':
        case 'requestMilestone':
        case 'requestToRelease':
        case 'serviceApproved':
        case 'serviceProjectEndingSeller':
        case 'serviceProjectPostedSeller':
        case 'serviceRejected':
        case 'signUpFreeTrialUpsell':
        case 'upsellCrowdsourceFinding':
          return addWebsocketDocuments(
            state,
            [action.payload],
            transformWebsocketNotification,
            {
              path: {
                collection: 'toastNotifications',
                authUid: action.payload.toUserId,
              },
            },
            action.payload.toUserId,
          );
        default:
          return state;
      }
    default:
      return state;
  }
}
