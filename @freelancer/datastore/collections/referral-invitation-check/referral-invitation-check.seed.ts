import { ReferralInvitationCheck } from './referral-invitation-check.model';

export interface GenerateReferralInvitationCheckOptions {
  readonly userId: number;
}

export function generateReferralInvitationCheckObject({
  userId,
}: GenerateReferralInvitationCheckOptions): ReferralInvitationCheck {
  return {
    id: userId.toString(),
    isEligible: true,
  };
}
