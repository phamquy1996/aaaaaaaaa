import { ReferralInvitationApi } from 'api-typings/common/common';
import { ReferralInvitation } from './referral-invitations.model';

export function transformReferralInvitations(
  referralInvitation: ReferralInvitationApi,
): ReferralInvitation {
  if (!referralInvitation.email || !referralInvitation.status) {
    throw new ReferenceError(`Missing a required referral invitation field.`);
  }

  return {
    id: referralInvitation.email,
    email: referralInvitation.email,
    status: referralInvitation.status,
    canResend: true,
  };
}
