import { assertNever } from '@freelancer/utils';
import { ProjectTypeApi } from 'api-typings/projects/projects';
import { ProjectBudgetOption } from './project-budget-options.model';

export interface GenerateProjectBudgetOptionsOptions {
  readonly currencyId?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 11;
  readonly projectType: ProjectTypeApi;
}

export function generateProjectBudgetOptions({
  currencyId = 1,
  projectType,
}: GenerateProjectBudgetOptionsOptions): ReadonlyArray<ProjectBudgetOption> {
  const language = 'en';

  return getCurrencies(currencyId, projectType).map(
    ({ minimum, maximum, name }) => ({
      id: `${currencyId}-${minimum}-${language}`,
      minimum,
      maximum,
      name,
      currencyId,
      projectType,
      language,
    }),
  );
}
function getCurrencies(
  currencyId: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 9 | 11,
  projectType: ProjectTypeApi,
): ReadonlyArray<{
  readonly minimum: number;
  readonly maximum?: number;
  readonly name: string;
}> {
  switch (projectType) {
    case ProjectTypeApi.FIXED:
      switch (currencyId) {
        case 1:
          return [
            { minimum: 10, maximum: 30, name: 'Micro Project' },
            { minimum: 30, maximum: 250, name: 'Simple project' },
            { minimum: 250, maximum: 750, name: 'Very small project' },
            { minimum: 750, maximum: 1500, name: 'Small project' },
            { minimum: 1500, maximum: 3000, name: 'Medium project' },
            { minimum: 3000, maximum: 5000, name: 'Large project' },
            { minimum: 5000, maximum: 10000, name: 'Larger project' },
            { minimum: 10000, maximum: 20000, name: 'Very Large project' },
            { minimum: 20000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 2:
          return [
            { minimum: 14, maximum: 30, name: 'Micro Project' },
            { minimum: 30, maximum: 250, name: 'Simple project' },
            { minimum: 250, maximum: 750, name: 'Very small project' },
            { minimum: 750, maximum: 1500, name: 'Small project' },
            { minimum: 1500, maximum: 3000, name: 'Medium project' },
            { minimum: 3000, maximum: 5000, name: 'Large project' },
            { minimum: 5000, maximum: 10000, name: 'Larger project' },
            { minimum: 10000, maximum: 20000, name: 'Very Large project' },
            { minimum: 20000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 3:
          return [
            { minimum: 10, maximum: 30, name: 'Micro Project' },
            { minimum: 30, maximum: 250, name: 'Simple project' },
            { minimum: 250, maximum: 750, name: 'Very small project' },
            { minimum: 750, maximum: 1500, name: 'Small project' },
            { minimum: 1500, maximum: 3000, name: 'Medium project' },
            { minimum: 3000, maximum: 5000, name: 'Large project' },
            { minimum: 5000, maximum: 10000, name: 'Larger project' },
            { minimum: 10000, maximum: 20000, name: 'Very Large project' },
            { minimum: 20000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 4:
          return [
            { minimum: 20, maximum: 100, name: 'Micro Project' },
            { minimum: 100, maximum: 400, name: 'Simple project' },
            { minimum: 400, maximum: 900, name: 'Very small project' },
            { minimum: 900, maximum: 2000, name: 'Small project' },
            { minimum: 2000, maximum: 4000, name: 'Medium project' },
            { minimum: 4000, maximum: 8000, name: 'Large project' },
            { minimum: 8000, maximum: 15000, name: 'Larger project' },
            { minimum: 15000, maximum: 30000, name: 'Very Large project' },
            { minimum: 30000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 5:
          return [
            { minimum: 80, maximum: 240, name: 'Micro Project' },
            { minimum: 240, maximum: 2000, name: 'Simple project' },
            { minimum: 2000, maximum: 6000, name: 'Very small project' },
            { minimum: 6000, maximum: 12000, name: 'Small project' },
            { minimum: 12000, maximum: 24000, name: 'Medium project' },
            { minimum: 24000, maximum: 40000, name: 'Large project' },
            { minimum: 40000, maximum: 80000, name: 'Larger project' },
            { minimum: 80000, maximum: 160000, name: 'Very Large project' },
            { minimum: 160000, maximum: 400000, name: 'Huge project' },
            { minimum: 400000, name: 'Major project' },
          ];
        case 6:
          return [
            { minimum: 12, maximum: 30, name: 'Micro Project' },
            { minimum: 30, maximum: 250, name: 'Simple project' },
            { minimum: 250, maximum: 750, name: 'Very small project' },
            { minimum: 750, maximum: 1500, name: 'Small project' },
            { minimum: 1500, maximum: 3000, name: 'Medium project' },
            { minimum: 3000, maximum: 5000, name: 'Large project' },
            { minimum: 5000, maximum: 10000, name: 'Larger project' },
            { minimum: 10000, maximum: 20000, name: 'Very Large project' },
            { minimum: 20000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 8:
          return [
            { minimum: 8, maximum: 30, name: 'Micro Project' },
            { minimum: 30, maximum: 250, name: 'Simple project' },
            { minimum: 250, maximum: 750, name: 'Very small project' },
            { minimum: 750, maximum: 1500, name: 'Small project' },
            { minimum: 1500, maximum: 3000, name: 'Medium project' },
            { minimum: 3000, maximum: 5000, name: 'Large project' },
            { minimum: 5000, maximum: 10000, name: 'Larger project' },
            { minimum: 10000, maximum: 20000, name: 'Very Large project' },
            { minimum: 20000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 9:
          return [
            { minimum: 25, maximum: 100, name: 'Micro Project' },
            { minimum: 100, maximum: 500, name: 'Simple project' },
            { minimum: 500, maximum: 1000, name: 'Very small project' },
            { minimum: 1000, maximum: 2000, name: 'Small project' },
            { minimum: 2000, maximum: 4000, name: 'Medium project' },
            { minimum: 4000, maximum: 8000, name: 'Large project' },
            { minimum: 8000, maximum: 15000, name: 'Larger project' },
            { minimum: 15000, maximum: 30000, name: 'Very Large project' },
            { minimum: 30000, maximum: 50000, name: 'Huge project' },
            { minimum: 50000, name: 'Major project' },
          ];
        case 11:
          return [
            { minimum: 600, maximum: 1500, name: 'Micro Project' },
            { minimum: 1500, maximum: 12500, name: 'Simple project' },
            { minimum: 12500, maximum: 37500, name: 'Very small project' },
            { minimum: 37500, maximum: 75000, name: 'Small project' },
            { minimum: 75000, maximum: 150000, name: 'Medium project' },
            { minimum: 150000, maximum: 250000, name: 'Large project' },
            { minimum: 250000, maximum: 500000, name: 'Larger project' },
            { minimum: 500000, maximum: 1000000, name: 'Very Large project' },
            { minimum: 1000000, maximum: 2500000, name: 'Huge project' },
            { minimum: 2500000, name: 'Major project' },
          ];
        default:
          return assertNever(currencyId);
      }
    case ProjectTypeApi.HOURLY:
      switch (currencyId) {
        case 1:
          return [
            { minimum: 2, maximum: 8, name: 'Basic' },
            { minimum: 8, maximum: 15, name: 'Moderate' },
            { minimum: 15, maximum: 25, name: 'Standard' },
            { minimum: 25, maximum: 50, name: 'Skilled' },
            { minimum: 50, name: 'Expert' },
          ];
        case 2:
          return [
            { minimum: 3, maximum: 10, name: 'Basic' },
            { minimum: 10, maximum: 20, name: 'Moderate' },
            { minimum: 20, maximum: 30, name: 'Standard' },
            { minimum: 30, maximum: 60, name: 'Skilled' },
            { minimum: 60, name: 'Expert' },
          ];
        case 3:
          return [
            { minimum: 2, maximum: 8, name: 'Basic' },
            { minimum: 8, maximum: 15, name: 'Moderate' },
            { minimum: 15, maximum: 25, name: 'Standard' },
            { minimum: 25, maximum: 50, name: 'Skilled' },
            { minimum: 50, name: 'Expert' },
          ];
        case 4:
          return [
            { minimum: 2, maximum: 5, name: 'Basic' },
            { minimum: 5, maximum: 10, name: 'Moderate' },
            { minimum: 10, maximum: 15, name: 'Standard' },
            { minimum: 18, maximum: 36, name: 'Skilled' },
            { minimum: 36, name: 'Expert' },
          ];
        case 5:
          return [
            { minimum: 16, maximum: 65, name: 'Basic' },
            { minimum: 65, maximum: 115, name: 'Moderate' },
            { minimum: 115, maximum: 200, name: 'Standard' },
            { minimum: 200, maximum: 400, name: 'Skilled' },
            { minimum: 400, name: 'Expert' },
          ];
        case 6:
          return [
            { minimum: 3, maximum: 10, name: 'Basic' },
            { minimum: 10, maximum: 20, name: 'Moderate' },
            { minimum: 20, maximum: 30, name: 'Standard' },
            { minimum: 30, maximum: 60, name: 'Skilled' },
            { minimum: 60, name: 'Expert' },
          ];
        case 8:
          return [
            { minimum: 2, maximum: 6, name: 'Basic' },
            { minimum: 6, maximum: 12, name: 'Moderate' },
            { minimum: 12, maximum: 18, name: 'Standard' },
            { minimum: 18, maximum: 36, name: 'Skilled' },
            { minimum: 36, name: 'Expert' },
          ];
        case 9:
          return [
            { minimum: 2, maximum: 8, name: 'Basic' },
            { minimum: 8, maximum: 15, name: 'Moderate' },
            { minimum: 15, maximum: 25, name: 'Standard' },
            { minimum: 25, maximum: 50, name: 'Skilled' },
            { minimum: 50, name: 'Expert' },
          ];
        case 11:
          return [
            { minimum: 100, maximum: 400, name: 'Basic' },
            { minimum: 400, maximum: 750, name: 'Moderate' },
            { minimum: 750, maximum: 1250, name: 'Standard' },
            { minimum: 1250, maximum: 2500, name: 'Skilled' },
            { minimum: 2500, name: 'Expert' },
          ];
        default:
          return assertNever(currencyId);
      }
    default:
      return assertNever(projectType);
  }
}
