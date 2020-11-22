import { ProjectBookmarkType } from './project-bookmarks.backend-model';
import { ProjectBookmark } from './project-bookmarks.model';

export interface GenerateProjectBookmarkOptions {
  readonly projectId: number;
  readonly type: ProjectBookmarkType;
  readonly subscribed?: boolean;
}

export function generateProjectBookmarkObject({
  projectId,
  type,
  subscribed = false,
}: GenerateProjectBookmarkOptions): ProjectBookmark {
  return {
    id: `${type}-${projectId}`, // see transformer
    projectId,
    type,
    subscribed,
  };
}
