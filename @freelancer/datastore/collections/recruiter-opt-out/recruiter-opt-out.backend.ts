import { Backend, OrderByDirection } from '@freelancer/datastore/core';
import { RecruiterOptOutCollection } from './recruiter-opt-out.types';

export function recruiterOptOutBackend(): Backend<RecruiterOptOutCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: undefined,
    push: (authUid, recruiterOptOut) => ({
      endpoint: 'projects/recruiter-opt-out.php',
      isGaf: true,
      asFormData: false,
      payload: {
        id: recruiterOptOut.id,
        keepFreeUpgrade: recruiterOptOut.keepFreeUpgrade ? 'true' : 'false',
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
