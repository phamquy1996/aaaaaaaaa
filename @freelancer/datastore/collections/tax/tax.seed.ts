import { Tax } from './tax.model';

export interface GenerateTaxOptions {
  readonly authUserId: number;
  readonly rate?: number;
  readonly eligible?: boolean;
}

// TODO: Generate tax objects for different countries
export function generateTaxObject({
  authUserId,
  rate = 0.1,
  eligible = false,
}: GenerateTaxOptions): Tax {
  return {
    id: authUserId.toString(),
    name: '', // Seems to be unused in the app
    rate,
    eligible,
  };
}
