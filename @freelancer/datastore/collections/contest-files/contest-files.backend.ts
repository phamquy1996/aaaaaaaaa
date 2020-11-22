import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestFilesCollection } from './contest-files.types';

export function contestFilesBackend(): Backend<ContestFilesCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query) => {
      const contestId = getQueryParamValue(query, 'contestId')[0];

      if (!contestId) {
        throw new Error('Missing contest ID when trying to fetch');
      }

      return {
        endpoint: `contests/0.1/contests/${contestId}/files`,
        isGaf: false,
        params: {},
      };
    },
    push: (authUid, file) => ({
      endpoint: `contests/0.1/contests/${file.contestId}/files`,
      method: 'POST',
      payload: {
        drive_file_id: file.id,
        contest_id: file.contestId,
        name: file.name,
      },
    }),
    set: undefined,
    update: undefined,
    remove: (_, fileId, file) => ({
      payload: {},
      endpoint: `contests/0.1/contests/${file.contestId}/files/${fileId}`,
      method: 'DELETE',
    }),
  };
}
