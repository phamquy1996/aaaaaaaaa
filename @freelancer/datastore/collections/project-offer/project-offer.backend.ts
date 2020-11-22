import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { BidAwardStatusApi } from 'api-typings/projects/projects';
import { ProjectOfferPostRawPayload } from './project-offer.backend-model';
import { ProjectOfferActionType } from './project-offer.model';
import { ProjectOfferCollection } from './project-offer.types';

export function projectOfferBackend(): Backend<ProjectOfferCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.ASC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: 'projects/offer.php',
      isGaf: true,
      params: {
        id: ids,
        projectId: getQueryParamValue(query, 'projectId'),
        sellerId: getQueryParamValue(query, 'freelancerId'),
      },
    }),
    push: (_, projectOffer) => {
      if (!projectOffer.awardStatus) {
        throw new Error('You must provide an awardStatus.');
      }

      let payload: ProjectOfferPostRawPayload | undefined;

      if (projectOffer.awardStatus === BidAwardStatusApi.AWARDED) {
        payload = {
          action: ProjectOfferActionType.ACCEPT,
          projectId: projectOffer.projectId,
        };
      }

      if (
        [
          BidAwardStatusApi.CANCELED,
          BidAwardStatusApi.REJECTED,
          BidAwardStatusApi.REVOKED,
        ].includes(projectOffer.awardStatus)
      ) {
        payload = {
          action: ProjectOfferActionType.REJECT,
          projectId: projectOffer.projectId,
        };
      }

      if (!payload) {
        throw new Error('Could not post due to missing payload.');
      }

      return {
        endpoint: 'projects/offer.php',
        isGaf: true,
        payload,
      };
    },
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
