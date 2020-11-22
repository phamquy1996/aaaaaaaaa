import { AuthState } from '@freelancer/auth';
import {
  AgentSession,
  BaseUser,
  Bid,
  Contest,
  HourlyContract,
  Invoice,
  Milestone,
  MilestoneRequest,
  Team,
  Thread,
  ThreadProject,
  UNLINKED_DISABLE_DATE,
  User,
} from '@freelancer/datastore/collections';
import {
  ContextTypeApi,
  ThreadTypeApi,
} from 'api-typings/messages/messages_types';
import { SourceTypeApi } from 'api-typings/support/support';
import { isSupportUser } from '../helpers';
import {
  canBeAccepted,
  canBeAwarded,
  canRequestMilestone,
  getBid,
  getFilteredMilestoneRequests,
  getFilteredMilestones,
  isAwarded,
  isHourlyBillingEnabled,
  isPending,
  isProjectOwner,
} from './state-helpers';
import { ContextBoxState } from './state-manager';

export function getState([
  authState,
  threadMembers,
  thread,
  project,
  contest,
  bids,
  milestones,
  milestoneRequests,
  hourlyContracts,
  agentSession,
  team,
  failedInvoices,
]: [
  AuthState | undefined,
  ReadonlyArray<User> | undefined,
  Thread,
  ThreadProject | undefined,
  Contest | undefined,
  ReadonlyArray<Bid> | undefined,
  ReadonlyArray<Milestone> | undefined,
  ReadonlyArray<MilestoneRequest> | undefined,
  ReadonlyArray<HourlyContract> | undefined,
  AgentSession | undefined,
  Team | undefined,
  ReadonlyArray<Invoice> | undefined,
]): ContextBoxState {
  if (!thread || !authState) {
    return undefined;
  }
  const authUid = Number(authState.userId);
  const bid = getBid(authUid, thread.members, bids || []);
  const currentUser = threadMembers
    ? threadMembers.find(u => authState && u.id === authUid)
    : undefined;
  const otherUser = threadMembers
    ? threadMembers.find(u => !!(authState && u.id !== authUid))
    : undefined;
  const filteredMilestones = getFilteredMilestones(
    authUid,
    thread.members,
    milestones || [],
  );
  const filteredMilestoneRequests = getFilteredMilestoneRequests(
    authUid,
    thread.members,
    milestoneRequests || [],
  );

  if (!otherUser) {
    return undefined;
  }

  if (
    thread.context.type === ContextTypeApi.TEAM ||
    (thread.threadType === ThreadTypeApi.TEAM &&
      team &&
      authUid !== team.ownerUserId)
  ) {
    return undefined;
  }

  if (
    (thread.threadType === ThreadTypeApi.ADMIN_PREFERRED_CHAT ||
      thread.threadType === ThreadTypeApi.GROUP) &&
    thread.context.type === ContextTypeApi.SUPPORT_SESSION &&
    threadMembers &&
    threadMembers.some(isSupportUser)
  ) {
    if (isSupportUser(currentUser)) {
      return projectAdminLink(otherUser, project, agentSession);
    }

    return projectLink(otherUser, project);
  }

  if (
    thread.threadType &&
    thread.threadType.toLowerCase() === ThreadTypeApi.GROUP
  ) {
    return projectLink(otherUser, project);
  }

  if (contest) {
    return {
      name: 'contest',
      linkText: contest.title,
      linkUrl: `/${contest.seoUrl}`,
      otherUserName: otherUser.displayName,
      timeSubmitted: contest.timeSubmitted,
    };
  }

  if (project && project.status === 'draft') {
    return projectLink(otherUser, project);
  }

  if (
    project &&
    project.projectCollaborations &&
    project.projectCollaborations.length &&
    (project.projectCollaborations
      .filter(pc => pc.userId)
      .map(pc => pc.userId)
      .includes(authUid) ||
      project.projectCollaborations
        .filter(pc => pc.userId)
        .map(pc => pc.userId)
        .includes(otherUser.id))
  ) {
    return projectLink(otherUser, project);
  }

  if (thread.threadType === 'private_chat' && !project) {
    return undefined;
  }

  if (thread.threadType === 'primary') {
    return {
      name: 'hireme',
      otherUserName: otherUser.displayName,
      button: {
        data: {
          type: 'LINK',
          buttonUrl: `/u/${otherUser.username}`,
          buttonExtras: {
            queryParams: {
              hireme: true,
            },
          },
        },
        tag: 'chatbox-hireme-button',
      },
    };
  }

  if (bid === undefined) {
    return projectLink(otherUser, project);
  }

  if (canBeAwarded(bid, authUid) && project && !project.hireme) {
    // TODO this should show some money info too?
    if (project.type === 'hourly') {
      return {
        name: 'projectAwardHourly',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'LINK',
            buttonUrl: `/projects/${project.seoUrl}`,
            buttonExtras: {
              queryParams: {
                awardBid: bid.id,
              },
            },
          },
          tag: 'chatbox-award-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    return {
      name: 'projectAwardFixed',
      linkText: project.title,
      linkUrl: `/projects/${project.seoUrl}`,
      button: {
        data: {
          type: 'AWARD_FIXED',
          bidId: bid.id,
          bidderId: bid.bidderId,
          projectId: project.id,
        },
        tag: 'chatbox-award-button',
      },
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }

  if (canBeAccepted(bid, authUid)) {
    if (project && project.hireme && project.isEscrowProject) {
      return {
        name: 'projectAcceptRedirect',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'LINK',
            buttonUrl: `/projects/${project.seoUrl}`,
          },
          tag: 'chatbox-accept-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (project && project.type === 'hourly') {
      return {
        name: 'projectAcceptHourly',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'ACCEPT',
            projectId: project.id,
            bidId: bid.id,
          },
          tag: 'chatbox-accept-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (project) {
      return {
        name: 'projectAcceptFixed',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'ACCEPT',
            projectId: project.id,
            bidId: bid.id,
          },
          tag: 'chatbox-accept-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
  }

  if (
    (isAwarded(bid) || isPending(bid)) &&
    isProjectOwner(bid, authUid) &&
    currentUser
  ) {
    if (
      project &&
      hourlyContracts &&
      // we only want to show Setup Billing to freelancers awarded as hourly-hourly
      hourlyContracts.length &&
      hourlyContracts.filter(isHourlyBillingEnabled).length === 0
    ) {
      return {
        name: 'setupBilling',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'LINK',
            buttonUrl: `/projects/${project.seoUrl}`,
          },
          tag: 'chatbox-billing-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (project && project.isEscrowProject) {
      return {
        name: 'milestoneCreateRedirect',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'LINK',
            buttonUrl: `/projects/${project.seoUrl}`,
          },
          tag: 'chatbox-create-milestone-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (
      project &&
      project.timeSubmitted > UNLINKED_DISABLE_DATE &&
      failedInvoices &&
      failedInvoices.length > 0
    ) {
      return {
        name: 'payFailedInvoices',
        linkText: project.title,
        linkUrl: `projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'LINK',
            buttonUrl: `/projects/${project.seoUrl}/payments`,
          },
          tag: 'chatbox-redirect-payments-page',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (project && filteredMilestoneRequests.length > 0) {
      return {
        name: 'milestoneCreateFromRequest',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'CREATE_MILESTONE',
            projectId: project.id,
            bidderId: bid.bidderId,
            bidId: bid.id,
            employerUsername: currentUser.username,
            currencyDetails: project.currency,
          },
          tag: 'chatbox-create-milestone-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (filteredMilestones.length === 0 && project) {
      return {
        name: 'milestoneCreateInitial',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'CREATE_MILESTONE',
            projectId: project.id,
            bidderId: bid.bidderId,
            bidId: bid.id,
            employerUsername: currentUser.username,
            currencyDetails: project.currency,
          },
          tag: 'chatbox-create-milestone-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
    if (project) {
      return {
        name: 'milestoneCreate',
        linkText: project.title,
        linkUrl: `/projects/${project.seoUrl}`,
        button: {
          data: {
            type: 'CREATE_MILESTONE',
            projectId: project.id,
            bidderId: bid.bidderId,
            bidId: bid.id,
            employerUsername: currentUser.username,
            currencyDetails: project.currency,
          },
          tag: 'chatbox-create-milestone-button',
        },
        otherUserName: otherUser.displayName,
        timeSubmitted: project.timeSubmitted,
      };
    }
  }

  if (
    project &&
    !project.local &&
    hourlyContracts &&
    !isProjectOwner(bid, authUid) &&
    bid.timeAccepted !== undefined &&
    hourlyContracts.filter(isHourlyBillingEnabled).length > 0
  ) {
    return {
      name: 'trackTime',
      linkText: project.title,
      linkUrl: `/projects/${project.seoUrl}`,
      button: {
        data: {
          type: 'LINK',
          buttonUrl: `/projects/${project.seoUrl}/tracking`,
          buttonExtras: {
            fragment: `timetracker-${bid.id}-invoice-0`,
          },
        },
        tag: 'chatbox-track-time-button',
      },
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }

  if (project && project.isEscrowProject && canRequestMilestone(bid, authUid)) {
    return {
      name: 'requestMilestoneRedirect',
      linkText: project.title,
      linkUrl: `/projects/${project.seoUrl}`,
      button: {
        data: {
          type: 'LINK',
          buttonUrl: `/projects/${project.seoUrl}`,
        },
        tag: 'chatbox-request-milestone-button',
      },
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }

  if (project && canRequestMilestone(bid, authUid)) {
    return {
      name: 'requestMilestone',
      linkText: project.title,
      linkUrl: `/projects/${project.seoUrl}`,
      button: {
        data: {
          type: 'REQUEST_MILESTONE',
          bidId: bid.id,
          projectId: project.id,
          employerUsername: otherUser.displayName,
          currencyDetails: project.currency,
          bidderId: bid.bidderId,
        },
        tag: 'chatbox-request-milestone-button',
      },
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }

  return projectLink(otherUser, project);
}

/**
 * If the project exists, returns a `'project'` state with just a link, else `undefined`.
 */
function projectLink(
  otherUser: BaseUser,
  project?: ThreadProject,
): ContextBoxState {
  if (project) {
    return {
      name: 'project',
      linkText: project.title,
      linkUrl: `/projects/${project.seoUrl}`,
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }
  return undefined;
}

function projectAdminLink(
  otherUser: BaseUser,
  project?: ThreadProject,
  agentSession?: AgentSession,
): ContextBoxState {
  // Admin project link
  if (project) {
    return {
      name: 'projectAdmin',
      linkUrl: `/admin/projects/properties.php`,
      linkText: project.title,
      linkQueryParams: { id: project.id },
      otherUserName: otherUser.displayName,
      timeSubmitted: project.timeSubmitted,
    };
  }

  // Deleted project link because the api does not return deleted projects
  if (
    !project &&
    agentSession &&
    agentSession.sessionSourceType === SourceTypeApi.PROJECT
  ) {
    return {
      name: 'projectAdmin',
      linkUrl: `/admin/projects/properties.php`,
      linkText: 'Deleted project',
      linkQueryParams: { id: agentSession.sessionSourceId },
      otherUserName: otherUser.displayName,
      timeSubmitted: 0,
    };
  }

  if (
    !project &&
    agentSession &&
    agentSession.sessionSourceType === SourceTypeApi.USER
  ) {
    return {
      name: 'userAdmin',
      linkUrl: `/admin/users/properties.php`,
      linkText: 'View user',
      linkQueryParams: { id: agentSession.sessionSourceId },
      otherUserName: otherUser.displayName,
      timeSubmitted: 0,
    };
  }

  return undefined;
}
