import { isDefined } from '@freelancer/utils';
import {
  SupportStatusApi,
  UserApi,
  UserOnlineOfflineStatusApi,
  UserStatusApi,
} from 'api-typings/users/users';
import { transformCustomFieldValues } from '../custom-field-info-configurations/custom-field-info-configurations.transformers';
import {
  Enterprise,
  Pool,
  POOL_ID_TO_POOL_API_MAP,
} from '../enterprise/enterprise.model';
import { UserStatus } from '../project-view-users/user-status.model';
import { BaseUser, SupportStatus, User } from './users.model';

export function transformBaseUser(user: UserApi): BaseUser {
  if (
    !user.id ||
    !user.username ||
    !user.avatar_cdn ||
    !user.avatar_large_cdn ||
    !user.role
  ) {
    throw new ReferenceError(`Missing a required user field.`);
  }

  const displayName: string =
    user.support_status && user.support_status.short_name
      ? user.support_status.short_name
      : user.public_name || user.display_name || user.username;

  return {
    id: user.id,
    avatar: transformUserImage(user.avatar_cdn),
    avatarLarge: transformUserImage(user.avatar_large_cdn),
    username: user.username,
    closed: user.closed || false,
    displayName,
    role: user.role,
    chosenRole: user.chosen_role,
    profileUrl: `/u/${user.username}`,
    currency: user.primary_currency,
    enterpriseIds: user.enterprise_ids,
    isDeloitteDcUser: user.enterprise_ids?.includes(Enterprise.DELOITTE_DC),
    // Handle the case where pool IDs are an integer, but also the case where
    // they are strings, to maintain forwards and backwards compatibility.
    // TODO: Cleanup T221545
    poolIds: (user.pool_ids || []).map(id =>
      typeof id === 'string' ? id : POOL_ID_TO_POOL_API_MAP[id as Pool],
    ),
    escrowComInteractionRequired: !!user.escrowcom_interaction_required,
    hasLinkedEscrowComAccount: !!user.escrowcom_account_linked,
    customFieldValues: user.enterprise_metadata_values
      ? user.enterprise_metadata_values.map(value =>
          transformCustomFieldValues(value),
        )
      : [],
  };
}

export function transformUser(user: UserApi): User {
  if (!user.status || !isDefined(user.limited_account)) {
    throw new ReferenceError(`Missing a required user field.`);
  }

  return {
    ...transformBaseUser(user),
    onlineOfflineStatus: user.online_offline_status
      ? transformUserOnlineOfflineStatus(user.online_offline_status)
      : undefined,
    status: transformUserStatus(user.status),
    supportStatus: user.support_status
      ? transformUserSupportStatus(user.support_status)
      : undefined,
    isLimitedAccount: user.limited_account,
  };
}

export function transformUserSupportStatus(
  supportStatus: SupportStatusApi,
): SupportStatus {
  return {
    type: supportStatus.type,
    shortName: supportStatus.short_name,
  };
}

export function transformUserOnlineOfflineStatus(
  onlineOfflineStatus: UserOnlineOfflineStatusApi,
) {
  return {
    status: onlineOfflineStatus.status,
    lastUpdatedTimestamp: onlineOfflineStatus.last_updated_timestamp
      ? onlineOfflineStatus.last_updated_timestamp * 1000
      : undefined,
  };
}

export function transformUserStatus(status: UserStatusApi): UserStatus {
  if (status.payment_verified === undefined) {
    throw new Error('Missing payment_verified from user status');
  }
  if (status.email_verified === undefined) {
    throw new Error('Missing email_verified from user status');
  }
  if (status.deposit_made === undefined) {
    throw new Error('Missing deposit_made from user status');
  }
  if (status.profile_complete === undefined) {
    throw new Error('Missing profile_complete from user status');
  }
  if (status.phone_verified === undefined) {
    throw new Error('Missing phone_verified from user status');
  }
  if (status.identity_verified === undefined) {
    throw new Error('Missing identity_verified from user status');
  }
  if (status.facebook_connected === undefined) {
    throw new Error('Missing facebook_connected from user status');
  }
  if (status.freelancer_verified_user === undefined) {
    throw new Error('Missing freelancer_verified_user from user status');
  }

  return {
    paymentVerified: status.payment_verified,
    emailVerified: status.email_verified,
    depositMade: status.deposit_made,
    profileComplete: status.profile_complete,
    phoneVerified: status.phone_verified,
    identityVerified: status.identity_verified,
    facebookConnected: status.facebook_connected,
    freelancerVerifiedUser: status.freelancer_verified_user,
  };
}

export function transformUserImage(image: string): string | undefined {
  return !image.endsWith('/img/unknown.png')
    ? // Ensure all URLs are secure to prevent HTTPS warnings in dev
      image.replace(/^\/\//, 'https://')
    : undefined;
}
