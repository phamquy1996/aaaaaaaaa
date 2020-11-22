import { NavigationExtras } from '@angular/router';
import { Auth, AuthState } from '@freelancer/auth';
import { combineLatestExtended } from '@freelancer/datastore';
import {
  AgentSession,
  Bid,
  Contest,
  Currency,
  HourlyContract,
  Invoice,
  Milestone,
  MilestoneRequest,
  Team,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';
import { ContextTypeApi } from 'api-typings/messages/messages_types';
import { SourceTypeApi } from 'api-typings/support/support';
import * as Rx from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { getState } from './get-state';

// TODO return struct
export type ContextBoxStateName =
  | 'contest'
  | 'hire'
  | 'milestoneCreate'
  | 'milestoneCreateFromRequest'
  | 'milestoneCreateInitial'
  | 'milestoneCreateRedirect'
  | 'payFailedInvoices'
  | 'project'
  | 'projectAcceptFixed'
  | 'projectAcceptRedirect'
  | 'projectAcceptHourly'
  | 'projectAdmin'
  | 'userAdmin'
  | 'projectAwardFixed'
  | 'projectAwardHourly'
  | 'recruiterSupportSession'
  | 'requestMilestone'
  | 'requestMilestoneRedirect'
  | 'setupBilling'
  | 'trackTime';

export type ContextBoxState =
  | undefined
  | {
      name: 'hireme';
      otherUserName: string;
      button: {
        data: ContextBoxButtonData;
        tag: ContextBoxButtonTag;
      };
    }
  | {
      name: ContextBoxStateName;
      linkUrl: string;
      linkText: string;
      linkQueryParams?: { [k: string]: string | number };
      button?: {
        data: ContextBoxButtonData;
        tag: ContextBoxButtonTag;
      };
      otherUserName: string;
      timeSubmitted?: number;
    };

export type ContextBoxButtonData =
  | {
      type: 'LINK';
      buttonUrl: string;
      buttonExtras?: NavigationExtras;
    }
  | {
      type: 'REQUEST_MILESTONE';
      bidId: number;
      projectId: number;
      employerUsername: string;
      currencyDetails: Currency;
      bidderId: number;
    }
  | {
      type: 'AWARD_FIXED';
      bidId: number;
      bidderId: number;
      projectId: number;
    }
  | {
      type: 'CREATE_MILESTONE';
      bidId: number;
      projectId: number;
      bidderId: number;
      employerUsername: string;
      currencyDetails: Currency;
    }
  | {
      type: 'ACCEPT';
      projectId: number;
      bidId: number;
    };

export type ContextBoxButtonTag =
  | 'chatbox-accept-button'
  | 'chatbox-award-button'
  | 'chatbox-billing-button'
  | 'chatbox-create-milestone-button'
  | 'chatbox-hireme-button'
  | 'chatbox-project-admin-button'
  | 'chatbox-request-milestone-button'
  | 'chatbox-redirect-payments-page'
  | 'chatbox-track-time-button';

export class StateManager {
  constructor(
    private auth: Auth,
    private thread$: Rx.Observable<Thread>,
    private threadMembers$: Rx.Observable<ReadonlyArray<User>>,
    private project$: Rx.Observable<ThreadProject>,
    private contest$: Rx.Observable<Contest>,
    private bids$: Rx.Observable<ReadonlyArray<Bid>>,
    private milestones$: Rx.Observable<ReadonlyArray<Milestone>>,
    private milestoneRequests$: Rx.Observable<ReadonlyArray<MilestoneRequest>>,
    private hourlyContracts$: Rx.Observable<ReadonlyArray<HourlyContract>>,
    private agentSession$: Rx.Observable<AgentSession>,
    private team$: Rx.Observable<Team>,
    private failedInvoices$: Rx.Observable<ReadonlyArray<Invoice>>,
  ) {}

  getState() {
    return combineLatestExtended([
      this.auth.authState$,
      startWithUndefined(this.threadMembers$),
      this.thread$.pipe(distinctUntilChanged()),
      startWithUndefined(this.project$),
      startWithUndefined(this.contest$),
      startWithUndefined(this.bids$),
      startWithUndefined(this.milestones$),
      startWithUndefined(this.milestoneRequests$),
      startWithUndefined(this.hourlyContracts$),
      startWithUndefined(this.agentSession$),
      startWithUndefined(this.team$),
      startWithUndefined(this.failedInvoices$),
    ]).pipe(
      map(args => cleanState(args)),
      map(args => getState(args)),
      distinctUntilChanged(),
    );
  }
}

/*
 * On switching from a thread with a project/contest context to one without,
 * the project and other related parameters don't emit from the datastore
 * as there is nothing to emit. As resetting the datastore query isn't a great
 * pattern, we can make use of constraints on the project/contest being linked
 * to the thread context, and reset the related parameters if they don't belong
 * with the current thread.
 *
 * NOTE: Please update this function with any additional constraints for any
 * future changes.
 */
function cleanState([
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
]): [
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
] {
  const correctProjectContext =
    project &&
    ((thread.context.type === ContextTypeApi.PROJECT &&
      thread.context.id === project.id) ||
      (agentSession &&
        thread.context.type === ContextTypeApi.SUPPORT_SESSION &&
        thread.context.id === agentSession.sessionId &&
        agentSession.sessionSourceType === SourceTypeApi.PROJECT &&
        agentSession.sessionSourceId === project.id));

  const correctContestContext =
    thread.context.type === 'contest' &&
    contest &&
    thread.context.id === contest.id;

  const correctHourlyContext = project && project.type === 'hourly';

  const correctAgentSessionContext =
    agentSession &&
    thread.context.type === ContextTypeApi.SUPPORT_SESSION &&
    thread.context.id === agentSession.sessionId;

  const correctFailedInvoicesContext =
    failedInvoices &&
    project &&
    failedInvoices.every(
      failedInvoice => failedInvoice.projectId === project.id,
    );

  return [
    authState,
    threadMembers,
    thread,
    correctProjectContext ? project : undefined,
    correctContestContext ? contest : undefined,
    correctProjectContext ? bids : undefined,
    correctProjectContext ? milestones : undefined,
    correctProjectContext ? milestoneRequests : undefined,
    correctProjectContext && correctHourlyContext ? hourlyContracts : undefined,
    correctAgentSessionContext ? agentSession : undefined,
    team,
    correctFailedInvoicesContext ? failedInvoices : undefined,
  ];
}

function startWithUndefined<T>(
  o$: Rx.Observable<T | undefined>,
): Rx.Observable<T | undefined> {
  return o$.pipe(startWith<T | undefined>(undefined), distinctUntilChanged());
}
