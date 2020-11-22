import { MembershipBadgeType } from '@freelancer/ui/badge';
import { generateAvatar } from '../users/users.seed';
import { UserInfo } from './user-info.model';

export interface GenerateUserInfoOptions {
  readonly userId: number;
  readonly username?: string;
  readonly publicName?: string;
}

export function generateUserInfoObject({
  userId,
  username = 'testUsername',
  publicName = 'Test Name',
}: GenerateUserInfoOptions): UserInfo {
  return {
    id: userId.toString(),
    userId,
    username,
    publicName,
    isFreeTrialEligible: false,
    isPlusTrialEligible: false,
    isPremium: false,
    avatar: generateAvatar(userId),
    membership: 'plus',
    membershipBadge: MembershipBadgeType.MONTHLY_LEVEL_THREE,
    hideMembershipUpgradeButton: false,
    monthlyTrial: false,
    canSwitchToUsers: [],
    isNoCommissionEligibleReferrer: false,
    isCorporate: false,
  };
}
