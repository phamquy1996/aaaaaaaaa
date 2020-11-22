import { mapValues } from '@freelancer/datastore/core';
import {
  average,
  generateArrayWithValues,
  generateIntegersInRange,
  generateNumbersInRange,
  randomiseList,
} from '@freelancer/datastore/testing';
import { RoleApi } from 'api-typings/common/common';
import { Reputation, ReputationData } from './reputation.model';

interface Range {
  readonly min: number;
  readonly max: number;
}

export enum FreelancerReputationKeys {
  TOTAL = 'total',
  COMPLETEPERCENTAGE = 'completePercentage',
  ONBUDGETPERCENTAGE = 'onBudgetPercentage',
  ONTIMEPERCENTAGE = 'onTimePercentage',
  REVIEWSPERCENTAGE = 'reviewsPercentage',
  INCOMPLETEREVIEWSPERCENTAGE = 'incompleteReviewsPercentage',
  COMMUNICATION = 'communication',
  EXPERTISE = 'expertise',
  HIREAGAIN = 'hireAgain',
  QUALITY = 'quality',
  PROFESSIONALISM = 'professionalism',
}

export type GenerateFreelancerReputationDataOptions = {
  readonly [k in FreelancerReputationKeys]?: Range;
};

export const generateReputationObject = generateFreelancerReputationObjects;

// FIXME: Make this more like generateFreelancerReputationsObjects
export function generateFreelancerReputationObjects({
  reputationOptions = {},
  earningsScore = { min: 4, max: 10 },
  userIds,
}: {
  readonly reputationOptions?: GenerateFreelancerReputationDataOptions;
  readonly earningsScore?: Range;
  readonly userIds: ReadonlyArray<number>;
}): ReadonlyArray<Reputation> {
  const entireHistoryList = generateFreelancerReputationDataObjects({
    ...reputationOptions,
    seed: 'entireHistory',
    numberToMake: userIds.length,
  });

  const last3MonthsList = generateFreelancerReputationDataObjects({
    ...mapValues(reputationOptions, range =>
      range
        ? {
            min: range.min / 4,
            max: range.max / 4,
          }
        : undefined,
    ),
    seed: 'last3Months',
    numberToMake: userIds.length,
  });

  const last12MonthsList = generateFreelancerReputationDataObjects({
    ...mapValues(reputationOptions, range =>
      range
        ? {
            min: range.min / 2,
            max: range.max / 2,
          }
        : undefined,
    ),
    seed: 'last12Months',
    numberToMake: userIds.length,
  });

  const earningsScores = randomiseList(
    generateNumbersInRange(
      earningsScore.min,
      earningsScore.max,
      userIds.length,
    ),
    'earningsScore',
  );

  return userIds.map((userId, index) => ({
    userId,
    entireHistory: entireHistoryList[index],
    last3Months: last3MonthsList[index],
    last12Months: last12MonthsList[index],
    role: RoleApi.EMPLOYER,
    earningsScore: earningsScores[index],
  }));
}

export function generateFreelancerReputationDataObjects({
  seed,
  numberToMake,
  total = { min: 0, max: 1_000 },
  communication = { min: 4, max: 5 },
  expertise = { min: 4, max: 5 },
  hireAgain = { min: 4, max: 5 },
  quality = { min: 4, max: 5 },
  professionalism = { min: 4, max: 5 },
  completePercentage = { min: 0.9, max: 1 },
  onBudgetPercentage = { min: 0.8, max: 1 },
  onTimePercentage = { min: 0.8, max: 1 },
  reviewsPercentage = { min: 0.75, max: 1 },
  incompleteReviewsPercentage = { min: 0.25, max: 0.5 },
}: GenerateFreelancerReputationDataOptions & {
  readonly seed: string;
  readonly numberToMake: number;
}): ReadonlyArray<ReputationData> {
  // Generate a third of the reviews as blank ones.
  const blankReviews = Math.floor(numberToMake / 3);

  // The total number of projects done, a combo of random numbers and blank ones.
  const totalCounts = randomiseList(
    [
      ...generateIntegersInRange(
        total.min,
        total.max,
        numberToMake - blankReviews,
      ),
      ...generateArrayWithValues(blankReviews, 0),
    ],
    'totalCounts',
  );

  const genRange = ({ min, max }: Range, extraSeed: string) =>
    randomiseList(
      generateNumbersInRange(min, max, numberToMake),
      seed + extraSeed,
    );

  const communications = genRange(communication, 'communication');
  const expertises = genRange(expertise, 'expertise');
  const hireAgains = genRange(hireAgain, 'hireAgain');
  const qualities = genRange(quality, 'quality');
  const professionalisms = genRange(professionalism, 'professionalism');
  const completePercentages = genRange(
    completePercentage,
    'completePercentage',
  );
  const onBudgetPercentages = genRange(
    onBudgetPercentage,
    'onBudgetPercentage',
  );
  const onTimePercentages = genRange(onTimePercentage, 'onTimePercentage');
  const reviewsPercentages = genRange(reviewsPercentage, 'reviewsPercentage');
  const incompleteReviewsPercentages = genRange(
    incompleteReviewsPercentage,
    'incompleteReviewsPercentage',
  );

  return totalCounts.map((totalCount, i) => {
    const complete = Math.floor(totalCount * completePercentages[i]);
    const incomplete = totalCount - complete;

    const reviews = Math.floor(totalCount * reviewsPercentages[i]);
    const incompleteReviews = Math.floor(
      (totalCount - reviews) * incompleteReviewsPercentages[i],
    );

    const categoryRatings = {
      communication: blankValue(totalCount, communications[i]),
      expertise: blankValue(totalCount, expertises[i]),
      hire_again: blankValue(totalCount, hireAgains[i]),
      quality: blankValue(totalCount, qualities[i]),
      professionalism: blankValue(totalCount, professionalisms[i]),
    };

    return {
      overall: average(Object.values(categoryRatings)) || 0,
      all: totalCount,

      complete,
      incomplete,
      reviews,
      incompleteReviews,

      onBudget: blankValue(totalCount, onBudgetPercentages[i]),
      onTime: blankValue(totalCount, onTimePercentages[i]),
      completionRate: blankValue(
        totalCount,
        Math.round((complete / totalCount) * 100),
      ),

      positive: 0, // This doesn't seem to be set for new reviews?
      categoryRatings,
    };
  });
}

// Set value to 0 if you've not done any work.
function blankValue(totalCount: number, value: number) {
  return totalCount === 0 ? 0 : value;
}
