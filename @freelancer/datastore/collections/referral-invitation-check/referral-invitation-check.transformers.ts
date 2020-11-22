import { ReferralInvitationCheck } from './referral-invitation-check.model';

// Transforms what the backend returns into ReferralInvitationCheck format.
// Should only be called in this collection's reducer.
export function transformReferralInvitationCheck(
  referralInvitationCheck: boolean,
  id: string,
): ReferralInvitationCheck {
  return {
    id, // User ID.
    isEligible: referralInvitationCheck,
  };
}
