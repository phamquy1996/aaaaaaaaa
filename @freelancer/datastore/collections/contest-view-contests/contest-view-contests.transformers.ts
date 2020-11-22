import { isDefined } from '@freelancer/utils';
import {
  ContestApi,
  ContestTypeApi,
  ContestUpgradesApi,
  EntryFileFormatApi,
} from 'api-typings/contests/contests';
import { ContestUpgrade } from '../contests/contests.model';
import { transformContest } from '../contests/contests.transformers';
import { ContestViewContest } from './contest-view-contests.model';

export function transformContestViewContest(
  contest: ContestApi,
): ContestViewContest {
  if (!contest.accepted_file_formats) {
    throw new ReferenceError('Missing accepted_file_formats field for contest');
  }

  return {
    ...transformContest(contest),
    upgrades: transformContestUpgrades(
      contest.upgrades,
      contest.type === ContestTypeApi.GUARANTEED,
    ),
    isPrizeAutodistributed: isDefined(contest.is_prize_autodistributed)
      ? contest.is_prize_autodistributed
      : false,
    usersInterested: contest.interested_freelancer_count || 0,
    /* FIXME: API GET endpoint currently returns an array
    of string. Remove the map function once API GET endpoint
    returns an array of type EntryFileFormatApi.*/
    acceptedFileFormats: contest.accepted_file_formats.map(
      fileFormat =>
        EntryFileFormatApi[
          fileFormat.toUpperCase() as keyof typeof EntryFileFormatApi
        ],
    ),
  };
}

export function transformContestUpgrades(
  upgrades: ContestUpgradesApi | undefined,
  guaranteed: boolean,
): ContestUpgrade | undefined {
  if (!upgrades) {
    return undefined;
  }

  return {
    guaranteed,
    featured: upgrades.featured || false,
    topContest: upgrades.topcontest || false,
    highlight: upgrades.highlighted || false,
    sealed: upgrades.sealed || false,
    nda: upgrades.nda || false,
    private: upgrades.nonpublic || false,
    urgent: upgrades.urgent || false,
  };
}

export function transformContestUpgradesApi(
  upgrades?: ContestUpgrade,
): ContestUpgradesApi | undefined {
  if (!upgrades) {
    return undefined;
  }

  return {
    featured: upgrades.featured,
    topcontest: upgrades.topContest,
    highlighted: upgrades.highlight,
    sealed: upgrades.sealed,
    nda: upgrades.nda,
    nonpublic: upgrades.private,
    urgent: upgrades.urgent,
  };
}
