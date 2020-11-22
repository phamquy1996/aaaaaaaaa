/**
 * Details relevant to a user's 2FA (two factor authentication).
 * Used for verifying logins.
 */
export interface TwoFactorDetails {
  /** user ID */
  readonly id: number;
  readonly userId: number;
  readonly methods: ReadonlyArray<TotpMethod>;
  readonly sms?: string;
}

export enum TotpMethod {
  EMAIL = 1,
  SMS,
  GENERATOR,
  APP_PUSH,
}
