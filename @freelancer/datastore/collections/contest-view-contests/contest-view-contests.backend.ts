import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { isDefined } from '@freelancer/utils';
import { ContestViewContestUpdatePayload } from './contest-view-contests.backend-model';
import { transformContestUpgradesApi } from './contest-view-contests.transformers';
import { ContestViewContestsCollection } from './contest-view-contests.types';

export function contestViewContestsBackend(): Backend<
  ContestViewContestsCollection
> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/contests`,
      method: 'GET',
      params: {
        contests: ids,
        owners: getQueryParamValue(query, 'ownerId'),
        statuses: getQueryParamValue(query, 'status'),
        entry_counts: 'true',
        interested_freelancer_count: 'true',
        job_details: 'true',
        upgrade_details: 'true',
        accepted_file_formats_details: 'true',
        is_prize_autodistributed_check: 'true',
      },
    }),
    push: (authUid, contest) => ({
      endpoint: 'contests/0.1/contests/',
      method: 'POST',
      payload: {
        owner_id: contest.ownerId,
        currency_id: contest.currency.id,
        job_ids: contest.skills.map(skill => skill.id),
        title: contest.title,
        prize: contest.prize,
        description: contest.description,
        duration: contest.duration,
        type: contest.type,
        upgrades: transformContestUpgradesApi(contest.upgrades),
        draft: contest.draft,
      },
    }),
    set: undefined,
    update: (authUid, contest, originalContest) => {
      let payload: ContestViewContestUpdatePayload | undefined;

      payload = {
        action: 'update',
        description: contest.description,
        prize: contest.prize,
      };

      if (contest.skills) {
        payload = {
          ...payload,
          job_ids: contest.skills
            .map(skill => (skill ? skill.id : undefined))
            .filter(isDefined),
        };
      }

      if (contest.acceptedFileFormats) {
        payload = {
          ...payload,
          accepted_file_formats: contest.acceptedFileFormats.filter(isDefined),
        };
      }

      if (contest.upgrades) {
        payload = {
          ...payload,
          guaranteed: contest.upgrades.guaranteed,
          topcontest: contest.upgrades.topContest,
          highlighted: contest.upgrades.highlight,
          nonpublic: contest.upgrades.private,
          featured: contest.upgrades.featured,
          sealed: contest.upgrades.sealed,
        };

        if (contest.upgrades.extraForUpdate) {
          payload = {
            ...payload,
            extend_length: contest.upgrades.extraForUpdate.extended,
          };
        }
      }

      return {
        endpoint: `contests/0.1/contests/${originalContest.id}/`,
        method: 'PUT',
        payload,
      };
    },
    remove: undefined,
  };
}
