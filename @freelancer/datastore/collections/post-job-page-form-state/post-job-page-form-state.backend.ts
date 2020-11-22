import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { PostJobPageFormStateCollection } from './post-job-page-form-state.types';

export function postJobPageFormStateBackend(): Backend<
  PostJobPageFormStateCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'job-post/drafts.php',
      isGaf: true,
    }),
    push: (_, postJobPageFormState) => ({
      asFormData: true,
      endpoint: 'job-post/drafts.php',
      isGaf: true,
      payload: {
        draftData: JSON.stringify(postJobPageFormState),
      },
    }),
    set: (_, postJobPageFormState) => ({
      asFormData: true,
      endpoint: 'job-post/drafts.php',
      isGaf: true,
      payload: {
        draftData: JSON.stringify(postJobPageFormState),
      },
    }),
    update: (_, postJobPageFormState) => ({
      asFormData: true,
      endpoint: 'job-post/drafts.php',
      isGaf: true,
      method: 'PUT',
      payload: {
        draftData: JSON.stringify(postJobPageFormState),
      },
    }),
    remove: () => ({
      endpoint: 'job-post/drafts.php',
      isGaf: true,
      method: 'DELETE',
      payload: {},
    }),
  };
}
