import { camelCase, generateId } from '@freelancer/datastore/testing';
import { PoolApi, RoleApi } from 'api-typings/common/common';
import {
  OnlineOfflineStatusApi,
  UserChosenRoleApi,
} from 'api-typings/users/users';
import {
  CurrencyCode,
  generateCurrencyObject,
} from '../currencies/currencies.seed';
import { CustomFieldValue } from '../custom-field-info-configurations/custom-field-info-configurations.model';
import { Enterprise } from '../enterprise/enterprise.model';
import { UserStatus } from '../project-view-users/user-status.model';
import { User } from './users.model';

export interface GenerateUsersOptions {
  readonly names: ReadonlyArray<string>;
  readonly enterpriseIds?: ReadonlyArray<number>;
  readonly role?: RoleApi;
  readonly chosenRole?: UserChosenRoleApi;
  readonly currencyCode?: CurrencyCode;
}

export interface GenerateUserOptions {
  readonly userId?: number;
  readonly username?: string;
  readonly displayName?: string;
  readonly enterpriseIds?: ReadonlyArray<number>;
  readonly poolIds?: ReadonlyArray<PoolApi>;
  readonly role?: RoleApi;
  readonly chosenRole?: UserChosenRoleApi;
  readonly currencyCode?: CurrencyCode;
  readonly userStatus?: UserStatus;
  readonly escrowComInteractionRequired?: boolean;
  readonly hasLinkedEscrowComAccount?: boolean;
  readonly isLimitedAccount?: boolean;
  readonly customFieldValues?: ReadonlyArray<CustomFieldValue>;
}

export function generateUserObjects({
  names,
  enterpriseIds,
  role,
  chosenRole,
  currencyCode,
}: GenerateUsersOptions): ReadonlyArray<User> {
  return names.map(name =>
    generateUserObject({
      userId: generateId(),
      username: camelCase(name),
      displayName: name,
      enterpriseIds,
      role,
      chosenRole,
      currencyCode,
    }),
  );
}

export function generateUserObject({
  userId,
  username = `testUsername${userId}`,
  displayName = 'Test Name',
  enterpriseIds = [],
  poolIds = [PoolApi.FREELANCER],
  role = RoleApi.EMPLOYER,
  chosenRole,
  currencyCode = CurrencyCode.USD,
  userStatus = verifiedUser().userStatus,
  escrowComInteractionRequired = false,
  hasLinkedEscrowComAccount = false,
  isLimitedAccount = false,
  customFieldValues = [],
}: GenerateUserOptions = {}): User {
  const id = userId !== undefined ? userId : generateId();
  const generatedChosenRole =
    chosenRole !== undefined
      ? chosenRole
      : role
      ? UserChosenRoleApi.EMPLOYER
      : UserChosenRoleApi.FREELANCER;

  return {
    id,
    avatar: generateAvatar(id),
    avatarLarge: generateAvatar(id, 280),
    username,
    closed: false,
    displayName,
    role,
    chosenRole: generatedChosenRole,
    profileUrl: `/u/${username}`,
    onlineOfflineStatus: { status: OnlineOfflineStatusApi.OFFLINE },
    currency: generateCurrencyObject(currencyCode),
    status: userStatus,
    enterpriseIds,
    // from transformer
    isDeloitteDcUser:
      enterpriseIds && enterpriseIds.includes(Enterprise.DELOITTE_DC),
    poolIds,
    escrowComInteractionRequired,
    hasLinkedEscrowComAccount,
    isLimitedAccount,
    customFieldValues,
  };
}

export function generateAvatar(id: number, size = 100) {
  return `assets/bits/avatars/32-${(id % 7) + 1}.jpg`; // TODO: Larger/more avatars
}

// ----- Mixins -----

export function employerUser(): Pick<
  GenerateUserOptions,
  'role' | 'chosenRole'
> {
  return {
    role: RoleApi.EMPLOYER,
    chosenRole: UserChosenRoleApi.EMPLOYER,
  };
}

export function freelancerUser(): Pick<
  GenerateUserOptions,
  'role' | 'chosenRole'
> {
  return {
    role: RoleApi.FREELANCER,
    chosenRole: UserChosenRoleApi.FREELANCER,
  };
}

export function arrowUser(): Pick<GenerateUserOptions, 'enterpriseIds'> {
  return {
    enterpriseIds: [Enterprise.ARROW],
  };
}

export function pmiUser(): Pick<GenerateUserOptions, 'enterpriseIds'> {
  return {
    enterpriseIds: [Enterprise.PMI],
  };
}

export function facebookUser(): Pick<GenerateUserOptions, 'enterpriseIds'> {
  return {
    enterpriseIds: [Enterprise.FACEBOOK],
  };
}

export function deloitteUser(): Pick<GenerateUserOptions, 'enterpriseIds'> {
  return {
    enterpriseIds: [Enterprise.DELOITTE_DC],
  };
}

export function deloitteUserWithCustomFields(
  customFieldValuesWithConfiguration: ReadonlyArray<CustomFieldValue>,
): Pick<GenerateUserOptions, 'enterpriseIds' | 'customFieldValues'> {
  return {
    ...deloitteUser(),
    customFieldValues: customFieldValuesWithConfiguration,
  };
}

export function unverifiedUser(): Required<
  Pick<GenerateUserOptions, 'userStatus'>
> {
  return {
    userStatus: {
      paymentVerified: false,
      emailVerified: false,
      depositMade: false,
      profileComplete: false,
      phoneVerified: false,
      identityVerified: false,
      facebookConnected: false,
      freelancerVerifiedUser: false,
    },
  };
}

/** All verified except for KYC and Facebook */
export function verifiedUser(): Required<
  Pick<GenerateUserOptions, 'userStatus'>
> {
  return {
    userStatus: {
      paymentVerified: true,
      emailVerified: true,
      depositMade: true,
      profileComplete: true,
      phoneVerified: true,
      identityVerified: false,
      facebookConnected: false,
      freelancerVerifiedUser: false,
    },
  };
}

export function emailUnverifiedUser(): Required<
  Pick<GenerateUserOptions, 'userStatus'>
> {
  return {
    userStatus: {
      paymentVerified: true,
      emailVerified: false,
      depositMade: true,
      profileComplete: true,
      phoneVerified: true,
      identityVerified: false,
      facebookConnected: false,
      freelancerVerifiedUser: false,
    },
  };
}

export function paymentUnverifiedUser(): Required<
  Pick<GenerateUserOptions, 'userStatus'>
> {
  return {
    userStatus: {
      paymentVerified: false,
      emailVerified: true,
      depositMade: true,
      profileComplete: true,
      phoneVerified: true,
      identityVerified: false,
      facebookConnected: false,
      freelancerVerifiedUser: false,
    },
  };
}

/**
 * Californian users are subject to a different flow, where they must first link
 * their accounts to Escrow.com, provide additional profile information, and
 * possibly KYC before being allowed to create bids or milestones. See T100016
 *
 * This flow applies when either employer or freelancer are Californian, so
 * remember to check both sides.
 *
 * As of writing, only Californian users are affected, but to decouple it from
 * a specific location, the frontend never checks a user's location to determine
 * whether to activate this flow.
 */
export function californianUser(): Pick<
  GenerateUserOptions,
  'escrowComInteractionRequired'
> {
  return {
    escrowComInteractionRequired: true,
  };
}

/**
 * A user that has been certified by Facebook as part of the Branded Communities
 * pilot. Mix this in to allow a user to see and bid on Facebook projects.
 */
export function facebookCertifiedUser(): Pick<GenerateUserOptions, 'poolIds'> {
  return {
    poolIds: [PoolApi.FACEBOOK],
  };
}
