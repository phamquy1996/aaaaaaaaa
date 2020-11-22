import { generateId } from '@freelancer/datastore/testing';
import { AddressApi } from 'api-typings/common/common';
import { DateOfBirthApi } from 'api-typings/users/users';
import { UserStatus } from '..';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { verifiedUser } from '../users/users.seed';
import { UsersSelf } from './users-self.model';
import { getUsersSelfComputedFields } from './users-self.transformers';

// From `GenerateUserOptions` with extra UserSelf-specific fields
export interface GenerateUserSelfOptions {
  readonly userId?: number;
  readonly username?: string;
  readonly displayName?: string;
  readonly enterpriseIds?: ReadonlyArray<number>;
  readonly currencyCode?: CurrencyCode;
  readonly userStatus?: UserStatus;
  readonly hasLinkedEscrowComAccount?: boolean;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly address?: AddressApi;
  readonly dateOfBirth?: DateOfBirthApi;
  readonly isLimitedAccount?: boolean;
  readonly email?: string;
}

export function generateUserSelfObject({
  userId = generateId(),
  username = 'testUsername',
  displayName = 'Test Name',
  enterpriseIds = [],
  currencyCode = CurrencyCode.USD,
  userStatus = verifiedUser().userStatus,
  hasLinkedEscrowComAccount = false,
  firstName = 'Test',
  lastName = 'Name',
  address = {
    address1: '525 W. Van Buren',
    address2: 'Suite 1100',
    city: 'Chicago',
    state_code: 'IL',
    zip: '60607',
    country: 'United States',
  },
  dateOfBirth,
  isLimitedAccount = false,
  email = 'testuser@freelancer.com',
}: GenerateUserSelfOptions = {}): UsersSelf {
  return {
    id: userId,
    username,
    displayName,
    enterpriseIds,
    status: userStatus,
    hasLinkedEscrowComAccount,
    isLimitedAccount,

    // fields specific to UsersSelf
    primaryCurrency: generateCurrencyObject(currencyCode),
    firstName,
    lastName,
    address,
    dateOfBirth,
    email,

    // Computed fields are `profileComplete` and `escrowProfileComplete`.
    // By default, the user is `profileComplete` but not `escrowProfileComplete`
    ...getUsersSelfComputedFields(firstName, lastName, address, dateOfBirth),
  };
}

export function escrowProfileCompleteUserSelf({
  dateOfBirth = {
    day: 1,
    month: 1,
    year: 1917,
  },
}: {
  readonly dateOfBirth?: DateOfBirthApi;
} = {}): Pick<GenerateUserSelfOptions, 'dateOfBirth'> {
  return {
    dateOfBirth,
  };
}
