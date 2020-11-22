import { UserRequiresGdpr } from './user-requires-gdpr.model';

export interface GenerateUserRequiresGdprOptions {
  readonly userId: string;
  readonly userRequiresGdpr: boolean;
}

export function generateUserRequiresGdprObject({
  userId,
  userRequiresGdpr,
}: GenerateUserRequiresGdprOptions): UserRequiresGdpr {
  return {
    id: userId,
    userRequiresGdpr,
  };
}
