import {
  addWebsocketDocuments,
  CollectionActions,
  CollectionStateSlice,
  deepSpread,
  mergeDocuments,
  pluckDocumentFromRawStoreCollectionState,
  transformIntoDocuments,
  updateWebsocketDocuments,
  WebsocketActionPayload,
} from '@freelancer/datastore/core';
import { NewsfeedApiEntry } from './newsfeed.backend-model';
import {
  transformNewsfeed,
  transformWebsocketBidToBidEvent,
  transformWebsocketContestEntryRated,
  transformWebsocketContestEntryToEntryApi,
  transformWebsocketNewsfeed,
  transformWebsocketUploadedFile,
  userDisplayName,
} from './newsfeed.transformers';
import { NewsfeedCollection } from './newsfeed.types';

export function newsfeedReducer(
  state = {},
  action: CollectionActions<NewsfeedCollection>,
) {
  switch (action.type) {
    case 'API_FETCH_SUCCESS':
      if (action.payload.type === 'newsfeed') {
        const { result, ref, order } = action.payload;
        return mergeDocuments<NewsfeedCollection>(
          state,
          transformIntoDocuments(
            result.hits.hits.map(hit => hit._source),
            transformNewsfeed,
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
        case 'acceptDisputeOffer':
        case 'accepted':
        case 'activateFreelancer':
        case 'adminForceVarifyPhone':
        case 'articleCommentReceived':
        case 'award':
        case 'completeContestReview':
        case 'completed':
        case 'completeReview':
        case 'contestAwardedToEmployer':
        case 'contestAwardedToFreelancer':
        case 'contestComplete':
        case 'contestExpired':
        case 'contestreviewposted':
        case 'createMilestone':
        case 'customAdminNotification':
        case 'denyed':
        case 'directTransferDone':
        case 'draftContest':
        case 'editAwardedBidAccepted':
        case 'emailChange':
        case 'escalateDispute':
        case 'hireMe':
        case 'inviteToContest':
        case 'inviteUserBid':
        case 'invoiceFeedback':
        case 'invoicePaid':
        case 'invoiceRequestChange':
        case 'invoiceRequested':
        case 'invoiceWithdrawn':
        case 'kyc':
        case 'makeDisputeOffer':
        case 'newDispute':
        case 'pendingFunds':
        case 'postDraftProject':
        case 'postOnBehalfProject':
        case 'prizeDispersedEmployer':
        case 'prizeDispersedFreelancer':
        case 'projectHireMeExpired':
        case 'projectSharedWithYou':
        case 'rejected':
        case 'rejectOnBehalfProject':
        case 'releaseMilestone':
        case 'releasePartMilestone':
        case 'remindUseBids':
        case 'requestEndProject':
        case 'requestMilestone':
        case 'requestToRelease':
        case 'reviewActivate':
        case 'reviewpostednew':
        case 'revoked':
        case 'sendDisputeMessage':
        case 'showcaseSourceApproval':
        case 'submitOnBehalfProject':
        case 'suggestionForFreelancerAfterReceiveReview':
        case 'updateMilestone':
        case 'upgradeToNonFreeMembership':
        case 'upsellPlusTrial':
        case 'userReportsActionBidRestriction':
        case 'welcome':
        case 'winningDesignReadyForReview':
          return addWebsocketDocuments(
            state,
            [action.payload],
            transformWebsocketNewsfeed,
            { path: { collection: 'newsfeed', authUid: userId } },
            userId,
          );

        // Add and Update Events with dependencies
        case 'contestCreated':
          return addDocumentsWithDependencies(state, action.payload);

        // Add or Self Update Events
        case 'bid':
        case 'contest_pcb':
        case 'contestEntryCreated':
        case 'contestEntryRated':
        case 'projectEmailVerificationRequiredEvent':
        case 'uploadFile':
          return addOrUpdateDocumentsWithDependencies(state, action.payload);

        default:
          return state;
      }
    }
    default:
      return state;
  }
}

function addDocumentsWithDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  return addWebsocketDocuments(
    updateDependentState(state, payload),
    [payload as NewsfeedApiEntry],
    transformWebsocketNewsfeed,
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
    payload.toUserId,
  );
}

function addOrUpdateDocumentsWithDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  let aggregatedId;
  switch (payload.type) {
    case 'uploadFile':
      aggregatedId = `${payload.toUserId}:uploadFile:${payload.data.projectId}`;
      break;
    case 'contestEntryRated':
      aggregatedId = `${payload.toUserId}:contestEntryRated:${payload.data.contestId}`;
      break;
    case 'contest_pcb':
      aggregatedId = `${payload.toUserId}:contest_pcb:${payload.data.contestId}`;
      break;
    case 'contestEntryCreated':
      aggregatedId = `${payload.toUserId}:contestEntryCreated:${payload.data.contestId}`;
      break;
    case 'bid':
      aggregatedId = `${payload.toUserId}:bid:${payload.data.projectId}`;
      break;
    case 'projectEmailVerificationRequiredEvent':
      aggregatedId = `${payload.toUserId}:projectEmailVerificationRequiredEvent:${payload.data.userId}`;
      break;
    default:
      throw new Error(
        `Newsfeed Event type '${payload.type}' has no implemented dependencies.`,
      );
  }

  return pluckDocumentFromRawStoreCollectionState(
    state,
    { collection: 'newsfeed', authUid: payload.toUserId },
    aggregatedId,
  )
    ? updateDependentState(state, payload)
    : addWebsocketDocuments(
        state,
        [payload],
        transformWebsocketNewsfeed,
        { path: { collection: 'newsfeed', authUid: payload.toUserId } },
        payload.toUserId,
      );
}

function updateDependentState(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  switch (payload.type) {
    case 'contest_pcb':
      return updateContestPcbDependencies(state, payload);
    case 'uploadFile':
      return updateUploadFileDependencies(state, payload);
    case 'contestCreated':
      return updateContestCreatedDependencies(state, payload);
    case 'contestEntryCreated':
      return updateContestEntryCreatedDependencies(state, payload);
    case 'contestEntryRated':
      return updateContestEntryRatedDependencies(state, payload);
    case 'bid':
      return updateBidDependencies(state, payload);
    case 'projectEmailVerificationRequiredEvent':
      return updateProjectEmailVerificationRequiredDependencies(state, payload);
    default:
      throw new Error(
        `Newsfeed Event type '${payload.type}' has no implemented dependencies.`,
      );
  }
}

function updateUploadFileDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:uploadFile:${payload.data.projectId}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    file => {
      if (file.type === 'uploadFile') {
        return {
          ...file,
          ...{
            data: {
              ...file.data,
              ...{
                filesList: [
                  ...file.data.filesList,
                  transformWebsocketUploadedFile(payload),
                ],
              },
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a uploadFile.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateContestPcbDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:contest_pcb:${payload.data.contestId}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    contest => {
      if (contest.type === 'contest_pcb') {
        return {
          ...contest,
          ...{
            data: {
              ...contest.data,
              // update these values when WS event is fired
              imgUrl: payload.data.imgUrl,
              username: payload.data.username,
              publicName: userDisplayName(
                payload.data.username,
                payload.data.userPublicName,
              ),
              messagesOverWs: contest.data.messagesOverWs + 1,
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a bid.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateContestCreatedDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:draftContest:${payload.data.contest_id}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    contest => {
      if (contest.type === 'draftContest') {
        return {
          ...contest,
          ...{
            data: {
              ...contest.data,
              isPublished: true,
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a draftContest.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateBidDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [`${payload.toUserId}:bid:${payload.data.projectId}`];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    bid => {
      if (bid.type === 'bid') {
        return {
          ...bid,
          ...{
            data: {
              ...bid.data,
              ...{
                bidList: [
                  ...bid.data.bidList,
                  transformWebsocketBidToBidEvent(payload),
                ],
              },
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a bid.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateProjectEmailVerificationRequiredDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:projectEmailVerificationRequiredEvent:${payload.toUserId}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    projectEmailVerificationRequiredEvent => {
      if (
        projectEmailVerificationRequiredEvent.type ===
        'projectEmailVerificationRequiredEvent'
      ) {
        return deepSpread(projectEmailVerificationRequiredEvent, {
          data: { projectId: payload.data.projectId },
          time: Date.now(),
        });
      }
      throw new Error(
        `Entry at ${updateIds} isn't a projectEmailVerificationRequiredEvent.`,
      );
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateContestEntryCreatedDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:contestEntryCreated:${payload.data.contestId}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    contestEntryCreated => {
      if (contestEntryCreated.type === 'contestEntryCreated') {
        const newEntry = transformWebsocketContestEntryToEntryApi(payload);
        return {
          ...contestEntryCreated,
          ...{
            data: {
              ...contestEntryCreated.data,
              ...{
                entriesList: [
                  ...contestEntryCreated.data.entriesList.filter(
                    entry => entry.id !== newEntry.id,
                  ),
                  newEntry,
                ],
              },
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a contestEntryCreated.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}

function updateContestEntryRatedDependencies(
  state: CollectionStateSlice<NewsfeedCollection>,
  payload: WebsocketActionPayload,
): CollectionStateSlice<NewsfeedCollection> {
  const updateIds = [
    `${payload.toUserId}:contestEntryRated:${payload.data.contestId}`,
  ];
  return updateWebsocketDocuments<NewsfeedCollection>(
    state,
    updateIds,
    contestEntryRated => {
      if (contestEntryRated.type === 'contestEntryRated') {
        const newEntry = transformWebsocketContestEntryRated(payload);
        return {
          ...contestEntryRated,
          ...{
            data: {
              ...contestEntryRated.data,
              ...{
                entriesList: [
                  ...contestEntryRated.data.entriesList.filter(
                    entry => entry.id !== newEntry.id,
                  ),
                  newEntry,
                ],
              },
            },
          },
        };
      }
      throw new Error(`Entry at ${updateIds} isn't a contestEntryRated.`);
    },
    { path: { collection: 'newsfeed', authUid: payload.toUserId } },
  );
}
