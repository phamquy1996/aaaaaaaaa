import { ContestMinimumBudgetClassificationAjax } from './contest-minimum-budget-classifications.backend-model';
import { ContestMinimumBudgetClassification } from './contest-minimum-budget-classifications.model';

export function transformContestMinimumBudgetClassification(
  classification: ContestMinimumBudgetClassificationAjax,
): ContestMinimumBudgetClassification {
  return {
    id: classification.id,
    currencyId: classification.currencyId,
    ok: classification.ok,
    good: classification.good,
    great: classification.great,
    excellent: classification.excellent,
    best: classification.best,
    amazing: classification.amazing,
  };
}
