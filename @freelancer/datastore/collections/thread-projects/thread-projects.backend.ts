import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ThreadProjectsCollection } from './thread-projects.types';

// IMPORTANT: When fetching threads, we passed in `context_details: true`
// param, aside from fetching the threads this will also fetch a document
// which can be a project or contest depending on the context type
// and since thread-projects.reducer.ts listens on both threads and threadsProject
// collections, we need to make sure that both collections returns the same fields
// of the same object for consistency and to avoid any potential bug, so any projection
// added here must be added to thread collection as well.

export function threadProjectsBackend(): Backend<ThreadProjectsCollection> {
  return {
    defaultOrder: {
      field: 'timeSubmitted',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `projects/0.1/projects`,
      params: {
        projects: ids || [],
        job_details: 'true',
      },
    }),
    push: undefined,
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
