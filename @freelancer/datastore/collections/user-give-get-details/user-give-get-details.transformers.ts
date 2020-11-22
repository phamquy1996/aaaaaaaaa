import { transformCurrencyAjax } from '../currencies/currencies.transformers';
import { UserGiveGetDetailsResultAjax } from './user-give-get-details.backend-model';
import { UserGiveGetDetails } from './user-give-get-details.model';

export function transformUserGiveGetDetails(
  userGiveGetDetails: UserGiveGetDetailsResultAjax,
  id: string,
): UserGiveGetDetails {
  return {
    id,
    isEligible: userGiveGetDetails.isEligible,
    isEmailVerified: userGiveGetDetails.isEmailVerified,
    isPhoneVerified: userGiveGetDetails.isPhoneVerified,
    isChildPaymentVerified: userGiveGetDetails.isChildPaymentVerified,
    localizedBonus: userGiveGetDetails.localizedBonus,
    localizedBonusRequirement: userGiveGetDetails.localizedBonusRequirement,
    referralLink: userGiveGetDetails.referralLink,
    userCurrency: transformCurrencyAjax(userGiveGetDetails.userCurrency),
  };
}
