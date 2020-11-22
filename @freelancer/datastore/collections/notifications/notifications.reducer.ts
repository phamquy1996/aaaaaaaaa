import {
  addWebsocketDocuments,
  CollectionActions,
  mergeDocuments,
  transformIntoDocuments,
} from '@freelancer/datastore/core';
import {
  transformNotification,
  transformWebsocketNotification,
} from './notifications.transformers';
import { NotificationsCollection } from './notifications.types';

export function notificationsReducer(
  state = {},
  action: CollectionActions<NotificationsCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'notifications') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<NotificationsCollection>(
          state,
          transformIntoDocuments(
            result.hits.hits.map(hit => hit._source),
            transformNotification,
            ref.path.authUid,
          ),
          order,
          ref,
        );
      }
      return state;
    case 'WS_MESSAGE': {
      if (action.no_persist) {
        return state;
      }
      const userId = action.payload.toUserId;
      switch (action.payload.type) {
        case 'contest':
        case 'project':
        case 'failingProject':
        case 'xpContest':
        case 'localJobPosted':
        case 'recruiterProject':
          return state;

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
        case 'showcaseSourceApproval':
        case 'signUpFreeTrialUpsell':
        case 'tasklistCreateV1':
        case 'upsellCrowdsourceFinding':
          return addWebsocketDocuments(
            state,
            [action.payload],
            transformWebsocketNotification,
            { path: { collection: 'notifications', authUid: userId } },
            userId,
          );

        default:
          return state;
      }
    }
    default:
      return state;
  }
}
