import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { PostFilesCollection } from './post-files.types';

export function postFilesBackend(): Backend<PostFilesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => {
      if (!ids) {
        throw new Error(
          "Undefined fileIds was given during fetching the post's files",
        );
      }
      return {
        endpoint: `posts/0.1/files`,
        isGaf: false,
        params: {
          file_ids: ids,
        },
      };
    },
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
