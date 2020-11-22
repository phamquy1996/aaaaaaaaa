import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ProjectBookmarksCollection } from './project-bookmarks.types';

export function projectBookmarksBackend(): Backend<ProjectBookmarksCollection> {
  return {
    defaultOrder: {
      field: 'projectId',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'bookmarks/projectBookmarks.php',
      isGaf: true,
      params: {
        project_id: getQueryParamValue(query, 'projectId')[0],
        type: getQueryParamValue(query, 'type')[0],
      },
    }),
    push: undefined,
    set: undefined,
    update: (authUid, oldBookmark, bookmark) => ({
      endpoint: 'bookmarks/projectBookmarks.php',
      isGaf: true,
      method: 'POST',
      payload: {
        project_id: bookmark.projectId,
        type: bookmark.type,
        subscribed: (oldBookmark && oldBookmark.subscribed !== undefined
        ? oldBookmark.subscribed
        : bookmark.subscribed)
          ? 'true'
          : 'false',
      },
    }),
    remove: undefined,
  };
}
