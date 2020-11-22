import { TimeMilliseconds } from '@freelancer/datastore';
import { generateId } from '@freelancer/datastore/testing';
import { ProjectViewProject } from '..';
import { AWARD_EXPIRY_INTERVAL, Bid } from '../bids/bids.model';
import { Currency } from '../currencies/currencies.model';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { generateProjectViewProjectObject } from '../project-view-projects/project-view-projects.seed';
import { User } from '../users/users.model';
import { generateAvatar, generateUserObject } from '../users/users.seed';
import {
  NotificationAccepted,
  NotificationAward,
  NotificationBid,
  NotificationProjectType,
} from './newsfeed.model';

export interface GenerateNotificationProjectAcceptedOptions {
  readonly freelancer?: User;
  readonly projectId?: number;
  readonly projectTitle?: string;
  readonly projectType?: NotificationProjectType;
  readonly projectSeoUrl?: string;
  readonly isAutomaticPayments?: boolean;
  readonly isHourly?: boolean;
  readonly milestoneCreated?: boolean;
}

export function generateNotificationAcceptedObject({
  freelancer = generateUserObject(),
  projectId = generateId(),
  projectTitle = 'Test project',
  projectType = NotificationProjectType.NORMAL,
  projectSeoUrl = `project-${projectId}`,
  isAutomaticPayments = false,
  isHourly = false,
  milestoneCreated = false,
}: GenerateNotificationProjectAcceptedOptions = {}): TimeMilliseconds &
  NotificationAccepted {
  return {
    type: 'accepted',
    parent_type: 'notifications',
    id: generateId().toString(),
    time: Date.now(),
    data: {
      id: projectId, // project ID
      imgUrl: freelancer.avatar ?? generateAvatar(0),
      isAutomaticPayments, // TODO: what does this mean?
      isHourly,
      milestoneCreated,
      name: projectTitle,
      projectType,
      publicName: freelancer.displayName,
      seoUrl: projectSeoUrl,
      userName: freelancer.username,
      userId: freelancer.id, // freelancer
    },
  };
}

export interface GenerateNotificationAwardOptions {
  readonly employer?: User;
  readonly project?: ProjectViewProject;
  readonly currency?: Currency;
  readonly bidAmount?: number;
  readonly bidPeriod?: number;
  // FIXME: not project.status but some custom string. Should be an enum, one of
  // the values seems to be 'rejected'
  readonly state?: string;
}

export function generateNotificationAwardObject({
  employer = generateUserObject(),
  project = generateProjectViewProjectObject({ ownerId: generateId() }),
  currency = generateCurrencyObject(CurrencyCode.USD),
  bidAmount = 20,
  bidPeriod = 7,
  state,
}: GenerateNotificationAwardOptions = {}): TimeMilliseconds &
  NotificationAward {
  return {
    type: 'award',
    parent_type: 'notifications',
    id: generateId().toString(),
    time: Date.now(),
    data: {
      bid: {
        amount: bidAmount,
        period: bidPeriod,
      },
      currency: {
        code: currency.code,
        sign: currency.sign,
      },
      acceptByTime: Date.now() + AWARD_EXPIRY_INTERVAL,
      appendedDescr: project.description ?? 'Test description',
      jobString: project.skills.map(skill => skill.name).join(', '),
      id: project.id,
      imgUrl: employer.avatar ?? generateAvatar(0),
      linkUrl: `/projects/${project.seoUrl}`,
      projIsHourly: !!project.hourlyProjectInfo,
      publicName: employer.displayName,
      state,
      title: project.title,
      username: employer.username,
      userId: employer.id,
    },
  };
}

export interface GenerateNotificationBidOptions {
  readonly bid: Bid;
  readonly bids: ReadonlyArray<Bid>;
  readonly bidder: User;
  readonly project: ProjectViewProject;
}

// NewsfeedItemBidComponent creates its own `NotificationBid` object from various
// datastore calls, so this may not be used
export function generateNotificationBidObject({
  bid,
  bids,
  bidder,
  project,
}: GenerateNotificationBidOptions): TimeMilliseconds & NotificationBid {
  if (!bids.length) {
    throw new Error('Provide at least one bid to create a NotificationBid');
  }

  return {
    type: 'bid',
    parent_type: 'notifications',
    id: generateId().toString(),
    time: Date.now(),
    data: {
      bidList: [], // transformer says this is always empty
      amount: bid.amount.toString(),
      bidAvg: bids.reduce((acc, b) => acc + b.amount, 0) / bids.length,
      bidCount: bids.length,
      bidId: bid.id,
      imgUrl: bidder.avatar,
      linkUrl: `/projects/${project.seoUrl}?gotoBid=${bid.id}`,
      projectId: project.id,
      projName: project.title,
      projIsHourly: !!project.hourlyProjectInfo,
      projSeoUrl: `/projects/${project.seoUrl}`,
      publicName: bidder.displayName,
      title: bid.description ?? '', // not project title, unused
      userId: bidder.id,
      username: bidder.username,
      description: bid.description,
      submitDate: bid.submitDate,
      currency: project.currency,
      period: bid.period.toString(),
      userAvatar: bidder.avatar,
    },
  };
}

// --- Mixins ---
