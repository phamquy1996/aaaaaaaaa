import { MembershipBadgeType } from '@freelancer/ui/badge';
import { toNumber } from '@freelancer/utils';
import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import {
  UserInfoResultAjax,
  UserInfoSwitchUserAjax,
} from './user-info.backend-model';
import { UserInfo, UserInfoSwitchUser } from './user-info.model';

// This takes an API response and transforms it into a User object
export function transformUserInfo(userInfo: UserInfoResultAjax): UserInfo {
  return {
    id: userInfo.id,
    userId: toNumber(userInfo.id),
    username: userInfo.username,
    publicName: userInfo.publicName,
    isFreeTrialEligible: userInfo.isFreeTrialEligible,
    isPlusTrialEligible: userInfo.isPlusTrialEligible,
    trialPackageId: userInfo.trialPackageId || undefined,
    isPremium: userInfo.isPremium,
    avatar: userInfo.logo,
    membership: userInfo.membership,
    membershipBadge: transformMembershipBadge(userInfo.membershipLevel),
    hideMembershipUpgradeButton: userInfo.hideMembershipUpgradeButton,
    trialDuration: userInfo.trialDuration || undefined,
    trialLandingUrlParams: userInfo.trialLandingUrlParams || undefined,
    monthlyTrial: userInfo.monthlyTrial,
    canSwitchToUsers: userInfo.canSwitchToUsers.map(
      (u: UserInfoSwitchUserAjax): UserInfoSwitchUser => ({
        userId: toNumber(u.user_id),
        publicName: u.publicName,
        username: u.username,
        avatar: u.logoUrl,
        membershipBadge: transformMembershipBadge(u.membershipLevel),
        balance: {
          amount: u.balance.amount,
          currency: transformCurrencyAjax(u.balance.currencyInfo),
          id: toNumber(u.balance.currencyInfo.id),
          primary: true,
        },
      }),
    ),
    isNoCommissionEligibleReferrer: userInfo.isNoCommissionEligibleReferrer,
    isCorporate: userInfo.isCorporate,
    enterpriseId: userInfo.enterpriseId ? userInfo.enterpriseId : undefined,
  };
}

function transformMembershipBadge(
  membershipLevel?: number | null,
): MembershipBadgeType | undefined {
  if (!membershipLevel) {
    return undefined;
  }

  switch (membershipLevel) {
    case 1:
      return MembershipBadgeType.MONTHLY_LEVEL_ONE;
    case 2:
      return MembershipBadgeType.MONTHLY_LEVEL_TWO;
    case 3:
      return MembershipBadgeType.MONTHLY_LEVEL_THREE;
    case 4:
      return MembershipBadgeType.MONTHLY_LEVEL_FOUR;
    case 5:
      return MembershipBadgeType.MONTHLY_LEVEL_FIVE;
    default:
      return undefined;
  }
}
