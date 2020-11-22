export enum ProjectBookmarkType {
  PROJECT = 'project',
  CONTEST = 'contest',
}

export interface ProjectBookmarksResultAjaxItem {
  readonly project_id: number;
  readonly subscribed: 'true' | 'false';
  // subscribed is not a boolean because boolean `false` doesn't pass the php FormInput validation..
  readonly type: ProjectBookmarkType;
}

export type ProjectBookmarksResultAjax = ReadonlyArray<
  ProjectBookmarksResultAjaxItem
>;
