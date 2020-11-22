import { ContestBudgetRange } from './contest-budget-ranges.model';

export function generateContestBudgetRangesObjects(): ReadonlyArray<
  ContestBudgetRange
> {
  return [
    { id: 1, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 2, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 3, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 4, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 5, defaultAmount: 1500, maximum: 12000, minimum: 80 },
    { id: 6, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 7, defaultAmount: 8500, maximum: 70000, minimum: 1250 },
    { id: 8, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 9, defaultAmount: 190, maximum: 1500, minimum: 10 },
    { id: 10, defaultAmount: 2000, maximum: 17500, minimum: 300 },
    { id: 11, defaultAmount: 12500, maximum: 120000, minimum: 500 },
    { id: 12, defaultAmount: 20000, maximum: 175000, minimum: 30000 },
    { id: 13, defaultAmount: 100000, maximum: 1000000, minimum: 15000 },
    { id: 14, defaultAmount: 2500, maximum: 20000, minimum: 400 },
    { id: 15, defaultAmount: 2200000, maximum: 17500000, minimum: 300000 },
    { id: 16, defaultAmount: 500, maximum: 5000, minimum: 100 },
    { id: 17, defaultAmount: 1250, maximum: 10000, minimum: 200 },
    { id: 19, defaultAmount: 20000, maximum: 150000, minimum: 90 },
    { id: 20, defaultAmount: 250, maximum: 8000, minimum: 40 },
    { id: 22, defaultAmount: 1235, maximum: 9750, minimum: 195 },
    { id: 23, defaultAmount: 4000000, maximum: 33000000, minimum: 600000 },
    { id: 24, defaultAmount: 7600, maximum: 60000, minimum: 1200 },
    { id: 25, defaultAmount: 1200, maximum: 10000, minimum: 200 },
    { id: 32, defaultAmount: 3000, maximum: 30000, minimum: 450 },
  ].map(({ id, defaultAmount, minimum, maximum }) => ({
    id,
    currencyId: id,
    defaultAmount,
    minimum,
    maximum,
  }));
}
