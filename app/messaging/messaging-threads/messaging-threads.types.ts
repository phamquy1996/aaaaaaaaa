import {
  Contest,
  Thread,
  ThreadProject,
  User,
} from '@freelancer/datastore/collections';

export enum ThreadTitleType {
  CONTEXT_TITLE = 'Context Title',
  USERNAME = 'Username',
}

export enum ThreadSubtitleType {
  ATTACHMENT = 'Attachment',
  CONTEXT_TITLE = 'Context Title',
  DELETED_PROJECT = 'Deleted Project',
  DELETED_CONTEST = 'Deleted Contest',
  LAST_MESSAGE = 'Last Message',
  TEAMS = 'Teams',
}

export interface ThreadDetails {
  thread: Thread;
  members: ReadonlyArray<User>;
  contextObject?: ThreadProject | Contest;
}

export enum ThreadFilterOption {
  ACTIVE = 'Active',
  UNREAD = 'Unread',
  SUPPORT = 'Support',
  ARCHIVED = 'Archived',
}

export enum ThreadsLoadingStateType {
  FULL_LIST,
  SPINNER,
}
