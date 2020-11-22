import { ProjectBookmarksResultAjaxItem } from './project-bookmarks.backend-model';
import { ProjectBookmark } from './project-bookmarks.model';

export function transformProjectBookmarks(
  projectBookmark: ProjectBookmarksResultAjaxItem,
): ProjectBookmark {
  return {
    type: projectBookmark.type,
    subscribed: projectBookmark.subscribed === 'true',
    projectId: projectBookmark.project_id,
    id: getProjectBookmarkId(projectBookmark),
  };
}

function getProjectBookmarkId(
  projectBookmark: ProjectBookmarksResultAjaxItem,
): string {
  return `${projectBookmark.type}${projectBookmark.project_id}`;
}
