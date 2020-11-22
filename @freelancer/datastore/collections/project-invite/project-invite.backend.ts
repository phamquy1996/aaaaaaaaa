import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { ProjectInviteCollection } from './project-invite.types';

export function projectInviteBackend(): Backend<ProjectInviteCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (_, projectInvite) => ({
      endpoint: `projects/0.1/projects/${projectInvite.projectId}/invite`,
      isGaf: false,
      payload: {
        freelancer_id: projectInvite.freelancerId,
        message: projectInvite.message,
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
