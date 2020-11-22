import {
  WebsocketContestData,
  WebsocketProjectData,
} from '@freelancer/datastore/core';
import { assertNever, isDefined, toNumber } from '@freelancer/utils';
import {
  NewsfeedApiContest,
  NewsfeedApiFailingProject,
  NewsfeedApiLocalJobPosted,
  NewsfeedApiProject,
  NewsfeedApiRecruiterProject,
  NewsfeedApiXpContest,
} from '../newsfeed/newsfeed.backend-model';
import {
  NotificationContestData,
  NotificationProjectData,
} from '../newsfeed/newsfeed.model';
import { ProjectFeedEntryAjax } from './project-feed.backend-model';
import { ProjectFeedEntry } from './project-feed.model';

type projectFields = 'imgUrl' | 'jobString' | 'linkUrl' | 'title' | 'userId';

export function transformProjectFeedData(
  data: Pick<WebsocketProjectData, projectFields | 'userName'>,
): Pick<NotificationProjectData, projectFields | 'username'> {
  return {
    imgUrl: data.imgUrl,
    jobString: data.jobString,
    linkUrl: data.linkUrl,
    title: data.title,
    userId: toNumber(data.userId),
    username: data.userName,
  };
}

type contestFields = 'jobString' | 'linkUrl' | 'time' | 'title' | 'userId';

export function transformContestFeedData(
  data: Pick<WebsocketContestData, contestFields | 'userName'>,
): Pick<NotificationContestData, contestFields | 'username'> {
  return {
    jobString: data.jobString,
    linkUrl: data.linkUrl,
    time: data.time * 1000, // Convert to milliseconds
    title: data.title,
    userId: toNumber(data.userId),
    username: data.userName,
  };
}

// This takes an API response and transforms it into a ProjectFeed object
export function transformProjectFeed(
  item: ProjectFeedEntryAjax,
): ProjectFeedEntry {
  switch (item.type) {
    case 'project': {
      return {
        type: item.type,
        id: `${item.type}-${item.id}`,
        ...transformProjectFeedData(item),
        currencyCode: item.currencyCode,
        freeBidUntil: item.free_bid_until,
        fulltime: Boolean(item.fulltime),
        hideBids: item.hidebids,
        maxBudget: toNumber(item.maxbudget),
        minBudget: toNumber(item.minbudget),
        publicName: undefined,
        recruiter: item.recruiter || false,
        time: item.time * 1000, // Convert to milliseconds
        description: item.appended_descr,
        // Issue due to union type of an array (Either Integer or String)
        // https://github.com/microsoft/TypeScript/issues/36390
        jobIds: (item.jobs as (number | string)[])
          .map(toNumber)
          .filter(isDefined),
      };
    }
    case 'contest': {
      return {
        type: item.type,
        id: `${item.type}-${item.id}`,
        ...transformContestFeedData(item),
        currencyCode: item.currencyCode,
        imgUrl: item.imgUrl,
        // Contest min and max budgets are normally the same, as it is in this event type
        minBudget: toNumber(item.maxbudget),
        maxBudget: toNumber(item.maxbudget),
        time: item.time * 1000, // Convert to milliseconds
        description: item.appended_descr,
        // Issue due to union type of an array (Either Integer or String)
        // https://github.com/microsoft/TypeScript/issues/36390
        jobIds: (item.jobs as any[]).map(toNumber).filter(isDefined),
      };
    }
    default:
      return assertNever(item.type);
  }
}

export function transformProjectFeedWS(
  entry:
    | NewsfeedApiContest
    | NewsfeedApiFailingProject
    | NewsfeedApiLocalJobPosted
    | NewsfeedApiProject
    | NewsfeedApiRecruiterProject
    | NewsfeedApiXpContest,
): ProjectFeedEntry {
  switch (entry.type) {
    case 'contest':
      return {
        type: entry.type,
        id: `${entry.type}-${entry.data.id}`,
        ...transformContestFeedData(entry.data),
        currencyCode: entry.data.currencyCode,
        imgUrl: entry.data.imgUrl,
        maxBudget: toNumber(entry.data.maxbudget),
        time: entry.timestamp * 1000, // Turn seconds to ms
        description: entry.data.appended_descr,
        // Issue due to union type of an array (Either Integer or String)
        // https://github.com/microsoft/TypeScript/issues/36390
        jobIds: (entry.data.jobs as any[]).map(toNumber).filter(isDefined),
      };
    case 'xpContest':
      return {
        type: entry.type,
        id: `${entry.type}-${entry.data.id}`,
        ...transformContestFeedData(entry.data),
        currencyCode: entry.data.currencyCode,
        imgUrl: entry.data.imgUrl,
        // Contest min and max budgets are normally the same, as it is in this event type
        minBudget: toNumber(entry.data.maxbudget),
        maxBudget: toNumber(entry.data.maxbudget),
        time: entry.timestamp * 1000, // Turn seconds to ms
        description: entry.data.appended_descr,
        // Issue due to union type of an array (Either Integer or String)
        // https://github.com/microsoft/TypeScript/issues/36390
        jobIds: (entry.data.jobs as any[]).map(toNumber).filter(isDefined),
      };
    case 'failingProject':
    case 'localJobPosted':
    case 'project': {
      const minBudget = toNumber(entry.data.minbudget);
      const maxBudget = toNumber(entry.data.maxbudget);
      return {
        type: entry.type,
        id: `${entry.type}-${entry.data.id}`,
        ...transformProjectFeedData(entry.data),
        currencyCode: entry.data.currencyCode,
        freeBidUntil: entry.data.free_bid_until,
        fulltime: entry.data.fulltime,
        hideBids: entry.data.hideBids,
        maxBudget,
        minBudget,
        publicName: entry.data.publicName,
        recruiter: entry.data.recruiter,
        time: entry.timestamp * 1000, // Convert to milliseconds
        description: entry.data.appended_descr,
        jobIds: (entry.data.jobs ?? []).map(toNumber).filter(isDefined),
      };
    }
    case 'recruiterProject': {
      const minBudget = toNumber(entry.data.minbudget);
      const maxBudget = toNumber(entry.data.maxbudget);
      return {
        type: entry.type,
        id: `project-${entry.data.id}`,
        ...transformProjectFeedData(entry.data),
        currencyCode: entry.data.currencyCode,
        freeBidUntil: entry.data.free_bid_until,
        fulltime: entry.data.fulltime,
        hideBids: entry.data.hideBids,
        maxBudget,
        minBudget,
        publicName: entry.data.publicName,
        recruiter: entry.data.recruiter,
        time: entry.timestamp * 1000, // Convert to milliseconds
        description: entry.data.appended_descr,
        jobIds: (entry.data.jobs ?? []).map(toNumber).filter(isDefined),
      };
    }
    default:
      return assertNever(entry);
  }
}
