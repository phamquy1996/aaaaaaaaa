/**
 * A country.
 */
export interface Country {
  readonly id: string; // id in this case is a literal unique country code (same as 'code')
  readonly code: string;
  readonly name: string;
  /** only present when fetching the `countries` collection */
  readonly phoneCode?: number;
  /** only present when fetching a user's location, e.g. `projectViewUsers` */
  readonly flagUrl?: string;
}

export function isCountry(country: Partial<Country>): country is Country {
  return (
    country.id !== undefined &&
    country.code !== undefined &&
    country.name !== undefined
  );
}
