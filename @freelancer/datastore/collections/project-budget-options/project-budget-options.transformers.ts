import { BudgetApi } from 'api-typings/projects/projects';
import { ProjectBudgetOption } from './project-budget-options.model';

export function transformProjectBudgetOptions(
  budget: BudgetApi,
  language: string = 'en',
): ProjectBudgetOption {
  if (!budget.name || !budget.project_type || !budget.currency_id) {
    throw new ReferenceError(`Missing a required project budget option field.`);
  }

  return {
    id: `${budget.currency_id}-${budget.minimum}-${language}`,
    minimum: budget.minimum,
    maximum: budget.maximum,
    name: budget.name,
    projectType: budget.project_type,
    currencyId: budget.currency_id,
    language,
  };
}
