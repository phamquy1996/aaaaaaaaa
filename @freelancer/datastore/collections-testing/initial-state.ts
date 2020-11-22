import { AuthServiceInterface } from '@freelancer/auth';
import {
  awardProjectRichMessage,
  offsitingMessageReminderFreelancerRichMessage,
  updateProjectViewProjectBidStats,
} from '@freelancer/datastore/collections';
import { DatastoreInterface } from '@freelancer/datastore/core';
import { paragraphs, peopleWithSurnames } from '@freelancer/datastore/testing';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import {
  createBanners,
  createBids,
  createContestBudgetRanges,
  createCurrencies,
  createDomain,
  createFreelancerReputations,
  createLanguage,
  createMessage,
  createMessages,
  createNotificationsPreferences,
  createOnlineOffline,
  createProjectBudgetOptions,
  createProjectUpgradeFees,
  createProjectViewBids,
  createProjectViewProject,
  createProjectViewUsers,
  createReferralInvitationCheck,
  createSiteStat,
  createSkills,
  createThread,
  createUser,
  createUserBalances,
  createUserCalifornianStatuses,
  createUserGiveGetDetail,
  createUserInfo,
  createUserRecentProjectsAndContests,
  createUsers,
  createUsersSelf,
} from './document-creators';

export async function constructInitialStoreState(
  auth: AuthServiceInterface,
  datastore: DatastoreInterface,
  authUid: number,
) {
  // Create self and other me things
  const { id: userId, username } = await createUsersSelf({
    userId: authUid,
  });
  const user = await createUser({ userId });

  // Used on the webapp playground
  await createUser({ userId: 13223 });
  await createUser({ userId: 133223 });

  await createUserInfo({ userId });
  await createUserGiveGetDetail({ userId, username });
  await createUserCalifornianStatuses({ userIds: [userId] });
  await createUserBalances();
  await createBanners();
  await createReferralInvitationCheck({ userId });
  await createNotificationsPreferences({});

  // Create project for PVP
  const project = await createProjectViewProject({
    projectId: 42,
    ownerId: userId,
  });
  const { id: projectId } = project;
  await createProjectUpgradeFees({ projectId });
  const bidders = await createUsers({ names: peopleWithSurnames });
  await createProjectViewUsers({
    users: [user, ...bidders],
  });

  const bidderIds = bidders.map(bidder => bidder.id);
  const bids = await createBids({
    bidderIds,
    projectId,
    projectOwnerId: userId,
    minAmount: 100,
    maxAmount: 200,
  });
  await createProjectViewBids({ bids });
  await updateProjectViewProjectBidStats(datastore, { projectId, bids });
  await createFreelancerReputations({ freelancerIds: bidderIds });
  await createOnlineOffline({ userIds: bidderIds });

  // Put project in nav
  await createUserRecentProjectsAndContests({ projects: [project] });

  // Create for PJP
  await createProjectBudgetOptions({
    projectType: ProjectTypeApi.FIXED,
  });
  await createProjectBudgetOptions({
    projectType: ProjectTypeApi.HOURLY,
  });
  await createContestBudgetRanges();

  // Create some messages
  const freelancerBotUser = await createUser({
    username: 'plagiarismDetector3000',
    displayName: 'Plagiarism Detector 3000',
  });

  const awardedThread = await createThread({
    userId: authUid,
    otherMembers: bidderIds.slice(0, 1),
    context: { type: ContextTypeApi.PROJECT, id: project.id },
  });
  await createMessage({
    fromUserId: authUid,
    thread: awardedThread,
    message: 'Hi there',
  });

  await createMessage({
    ...awardProjectRichMessage({
      freelancerBotUser,
      thread: awardedThread,
      bidId: bids[0].id,
    }),
  });

  const offsitingThread = await createThread({
    userId: authUid,
    otherMembers: bidderIds.slice(1, 2),
    context: { type: ContextTypeApi.PROJECT, id: project.id },
  });
  await createMessage({
    fromUserId: authUid,
    thread: offsitingThread,
    message: 'Pay me over Skype',
  });

  await createMessage({
    ...offsitingMessageReminderFreelancerRichMessage({
      freelancerBotUser,
      thread: offsitingThread,
    }),
  });

  /** A few threads reading books to you. */
  Promise.all(
    Object.values(paragraphs).map(async (paragraph, index) =>
      createMessages({
        fromUserId: authUid,
        thread: await createThread({
          userId: authUid,
          otherMembers: bidderIds.slice(index + 4, index + 5),
          context: { type: ContextTypeApi.PROJECT, id: project.id },
        }),
        messages: paragraph,
      }),
    ),
  );

  // Create global things
  await createSiteStat({ userId });
  await createLanguage();
  await createDomain();
  await createCurrencies();
  await createSkills();
}
