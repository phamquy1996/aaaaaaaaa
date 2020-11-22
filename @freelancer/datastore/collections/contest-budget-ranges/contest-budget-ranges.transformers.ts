import { ContestBudgetRangeEntryAjax } from './contest-budget-ranges.backend-model';
import { ContestBudgetRange } from './contest-budget-ranges.model';

export function transformContestBudgetRange(
  contestBudgetRange: ContestBudgetRangeEntryAjax,
): ContestBudgetRange {
  return {
    currencyId: contestBudgetRange.currencyId,
    defaultAmount: contestBudgetRange.defaultAmount,
    id: contestBudgetRange.id,
    maximum: contestBudgetRange.maximum,
    minimum: contestBudgetRange.minimum,
  };
}
