import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { UserGiveGetDetails } from './user-give-get-details.model';

export interface GenerateUserGiveGetDetailsOptions {
  readonly userId: number;
  readonly username: string;
  readonly currencyCode?: CurrencyCode;
}

export function generateUserGiveGetDetailsObject({
  userId,
  username,
  currencyCode = CurrencyCode.USD,
}: GenerateUserGiveGetDetailsOptions): UserGiveGetDetails {
  return {
    id: userId.toString(),
    isEligible: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isChildPaymentVerified: true,
    localizedBonus: 20,
    localizedBonusRequirement: 50,
    referralLink: `/get/${username}`, // FIXME: Does this need the hostname?
    userCurrency: generateCurrencyObject(currencyCode),
  };
}
