import { isDefined } from '@freelancer/utils';
import { AddressApi } from 'api-typings/common/common';
import {
  DateOfBirthApi,
  MarketingMobileNumberApi, // tslint:disable-next-line: ordered-imports-freelancer
  MarketingMobileNumberResultApi,
  UserApi,
} from 'api-typings/users/users';
import { getDate, getMonth, getYear } from 'date-fns';
import { transformCurrency } from '../currencies/currencies.transformers';
import { transformUserStatus } from '../users/users.transformers';
import { MarketingMobileNumber, UsersSelf } from './users-self.model';

/**
 * This transforms a usersSelf GET request with the projections set.
 */
export function transformUsersSelf(user: UserApi): UsersSelf {
  if (!user.status) {
    throw new ReferenceError('User missing field `status`');
  }

  if (!isDefined(user.limited_account)) {
    throw new ReferenceError('User missing field `limited_account`');
  }

  return {
    ...transformUsersSelfWithoutProjections(user),
    status: transformUserStatus(user.status),
    marketingMobileNumber: user.marketing_mobile_number
      ? transformMarketingMobileNumber(user.marketing_mobile_number)
      : undefined,
    isLimitedAccount: user.limited_account,
  };
}

/**
 * This transforms a usersSelf update request WITHOUT any projections set.
 */
function transformUsersSelfWithoutProjections(
  user: UserApi,
): Omit<UsersSelf, 'status' | 'marketingMobileNumber' | 'isLimitedAccount'> {
  if (!user.primary_currency) {
    throw new ReferenceError('User without primary currency!');
  }

  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    publicName: user.public_name,
    displayName: user.display_name,
    primaryCurrency: transformCurrency(user.primary_currency),
    address: user.address,
    dateOfBirth: user.date_of_birth,
    primaryLanguage: user.primary_language,
    hasLinkedEscrowComAccount: user.escrowcom_account_linked
      ? user.escrowcom_account_linked
      : false,
    email: user.email,
    ...getUsersSelfComputedFields(
      user.first_name,
      user.last_name,
      user.address,
      user.date_of_birth,
    ),
    enterpriseIds: user.enterprise_ids,
    freelancerVerifiedStatus: user.freelancer_verified_status,
  };
}

/**
 * This transforms a usersSelf update request WITHOUT any projections set.
 */
export function mergeUpdateSuccessResult(
  user: UserApi,
  originalUser: UsersSelf,
): UsersSelf {
  return {
    status: originalUser.status,
    marketingMobileNumber: originalUser.marketingMobileNumber,
    isLimitedAccount: originalUser.isLimitedAccount,
    ...transformUsersSelfWithoutProjections(user),
  };
}

/**
 * These fields aren't returned by the backend but are computed from other
 * fields on `UsersSelf`
 */
export function getUsersSelfComputedFields(
  firstName?: string,
  lastName?: string,
  address?: AddressApi,
  dob?: DateOfBirthApi,
) {
  return {
    profileCompleted: !!firstName && !!lastName && !!address,
    escrowProfileCompleted:
      !!firstName &&
      !!lastName &&
      !!dob &&
      !!address &&
      !!address.address1 &&
      !!address.city &&
      !!address.state_code &&
      !!address.country &&
      !!address.zip,
  };
}

export function transformDOBToDMY(dob: Date): DateOfBirthApi {
  return {
    day: getDate(dob),
    month: getMonth(dob) + 1,
    year: getYear(dob),
  };
}

/** The format of fl-input uses for date is ISO String */
export function transformDMYToDOBString(dob: DateOfBirthApi): string {
  const date = new Date(dob.year, dob.month - 1, dob.day);
  return date.toISOString();
}

export function transformMarketingMobileNumberAPIResult(
  marketingMobileNumberResult: MarketingMobileNumberResultApi,
  original: UsersSelf,
): UsersSelf {
  const marketingMobileNumber = {
    phoneNumber:
      marketingMobileNumberResult.marketing_mobile_number.phone_number,
    countryCode:
      marketingMobileNumberResult.marketing_mobile_number.country_code,
    status: marketingMobileNumberResult.marketing_mobile_number.status,
  };
  return {
    ...original,
    marketingMobileNumber,
  };
}

function transformMarketingMobileNumber(
  marketingMobileNumber: MarketingMobileNumberApi,
): MarketingMobileNumber {
  return {
    phoneNumber: marketingMobileNumber.phone_number,
    countryCode: marketingMobileNumber.country_code,
    status: marketingMobileNumber.status,
  };
}
