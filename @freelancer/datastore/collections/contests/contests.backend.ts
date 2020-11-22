import {
  Backend,
  getQueryParamValue,
  OrderByDirection,
} from '@freelancer/datastore/core';
import { ContestUpgradesApi } from 'api-typings/contests/contests';
import { ContestUpgrade } from './contests.model';
import { ContestsCollection } from './contests.types';

export function contestsBackend(): Backend<ContestsCollection> {
  return {
    defaultOrder: {
      field: 'id',
      direction: OrderByDirection.DESC,
    },
    fetch: (authUid, ids, query, order) => ({
      endpoint: `contests/0.1/contests`,
      params: {
        contests: ids,
        owners: getQueryParamValue(query, 'ownerId'),
        /*
        ContestStatus:
            INACTIVE:
              Contest is still in draft and hasn't been paid for.
            ACTIVE:
              Contest is open which means that freelancers may submit entries at any time.
            PENDING:
              Contest goes into pending when duration is over. Contest holder can still award an entry at this point.
            CLOSED:
              Contest is done and has already completed handover process.
            ACTIVE_NOT_EXPIRED:
              Contest is an active design studio contest. This is a contest created from a design project.
      */
        statuses: getQueryParamValue(query, 'status'),
        entry_counts: 'true',
        // filters contest that has entry by user
        entrants:
          query && query.searchQueryParams && query.searchQueryParams.entrants,
      },
    }),
    push: (authUid, contest) => ({
      endpoint: 'contests/0.1/contests/',
      payload: {
        owner_id: contest.ownerId,
        currency_id: contest.currency.id,
        job_ids: contest.skills.map(skill => skill.id),
        title: contest.title,
        prize: contest.prize,
        description: contest.description,
        duration: contest.duration,
        type: contest.type,
        upgrades: contest.upgrades ? convertUpgrades(contest.upgrades) : {},
        draft: contest.draft,
        file_ids: contest.fileIds ? contest.fileIds : [],
      },
    }),
    set: undefined,
    update: undefined,
    remove: undefined,
  };
}
function convertUpgrades(upgrades: ContestUpgrade): ContestUpgradesApi {
  return {
    featured: upgrades.featured,
    sealed: upgrades.sealed,
    topcontest: upgrades.topContest,
    highlighted: upgrades.highlight,
    urgent: upgrades.urgent,
    nonpublic: upgrades.private,
    nda: upgrades.nda,
  };
}
