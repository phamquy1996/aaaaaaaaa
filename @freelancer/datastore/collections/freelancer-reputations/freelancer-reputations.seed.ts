import {
  generateNumbersInRange,
  randomiseList,
} from '@freelancer/datastore/testing';
import { RoleApi } from 'api-typings/common/common';
import {
  generateFreelancerReputationDataObjects,
  GenerateFreelancerReputationDataOptions,
} from '../reputation/reputation-data.seed';
import { FreelancerReputation } from './freelancer-reputations.model';

interface Range {
  readonly min: number;
  readonly max: number;
}

export interface GenerateFreelancerReputationsOptions {
  readonly freelancerIds: ReadonlyArray<number>;
  readonly reputationOptions?: GenerateFreelancerReputationDataOptions;
  readonly earningsScore?: Range;
}

export function generateFreelancerReputationsObjects({
  freelancerIds,
  reputationOptions = {},
  earningsScore = { min: 3, max: 10 },
}: GenerateFreelancerReputationsOptions): ReadonlyArray<FreelancerReputation> {
  // Generate a third of the reviews as blank ones.

  const entireHistories = generateFreelancerReputationDataObjects({
    ...reputationOptions,
    seed: 'entireHistory',
    numberToMake: freelancerIds.length,
  });

  const earningsScores = randomiseList(
    generateNumbersInRange(
      earningsScore.min,
      earningsScore.max,
      freelancerIds.length,
    ),
    'earningsScore',
  );

  return freelancerIds.map((freelancerId, i) => ({
    id: freelancerId,
    role: RoleApi.FREELANCER,
    // Set value to 0 if you've not done any work.
    earningsScore: entireHistories[i].all === 0 ? 0 : earningsScores[i],

    entireHistory: entireHistories[i],
  }));
}
