import { ContestBudgetClassificationApi } from 'api-typings/contests/contests';

/**
 * This model determines a currency's minimum budget per classification
 * which is used in the contest budget selection
 */
export interface ContestMinimumBudgetClassification {
  readonly id: number;
  readonly currencyId: number;
  readonly ok: number;
  readonly good: number;
  readonly great: number;
  readonly excellent: number;
  readonly best: number;
  readonly amazing: number;
}

export enum ContestBudgetClassification {
  OK = ContestBudgetClassificationApi.OK,
  GOOD = ContestBudgetClassificationApi.GOOD,
  GREAT = ContestBudgetClassificationApi.GREAT,
  EXCELLENT = ContestBudgetClassificationApi.EXCELLENT,
  BEST = ContestBudgetClassificationApi.BEST,
  AMAZING = ContestBudgetClassificationApi.AMAZING,
}
