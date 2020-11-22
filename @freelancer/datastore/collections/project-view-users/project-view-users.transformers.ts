import { MembershipBadgeType } from '@freelancer/ui/badge';
import {
  QualificationApi,
  TimeUnitApi,
  TimezoneApi,
} from 'api-typings/common/common';
import {
  BadgeApi,
  CorporateDetailsApi,
  MembershipPackageApi,
  ReputationApi,
  UserApi,
  UserSanctionApi,
} from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import {
  Enterprise,
  Pool,
  POOL_ID_TO_POOL_API_MAP,
} from '../enterprise/enterprise.model';
import {
  CorporateDetails,
  Timezone,
} from '../profile-view-users/profile-view-users.model';
import { Qualification } from '../project-view-projects/project-view-projects.model';
import { transformReputation } from '../reputation/reputation.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { transformLocation } from '../users/users-location.transformers';
import {
  transformUserImage,
  transformUserStatus,
} from '../users/users.transformers';
import { Badge } from './badge.model';
import {
  MembershipPackage,
  ProjectViewUser,
  UserResponsiveness,
  UserSanction,
} from './project-view-users.model';

// FIXME: optionals are a mess, 'private' transformer imports which we use
// here to reuse logic, work out appropriate default values, eliminate throws
// as much as possible
export function transformProjectViewUsers(user: UserApi): ProjectViewUser {
  if (
    !user.avatar_cdn ||
    !user.avatar_large_cdn ||
    !user.chosen_role ||
    !user.id ||
    !user.location ||
    !user.primary_currency ||
    !user.registration_date ||
    !user.reputation ||
    !user.role ||
    !user.status ||
    !user.username
  ) {
    throw new ReferenceError(`Missing a required user field.`);
  }

  return {
    avatar: transformUserImage(user.avatar_cdn),
    avatarLarge: transformUserImage(user.avatar_large_cdn),
    badges: (user.badges || []).map(transformBadge),
    displayName: user.public_name || user.display_name || user.username,
    chosenRole: user.chosen_role,
    employerReputation: user.employer_reputation
      ? transformReputation(user.employer_reputation)
      : undefined,
    hourlyRate: user.hourly_rate,
    id: user.id,
    isNewFreelancer: user.reputation
      ? transformIsNewFreelancer(user.reputation)
      : undefined,
    skills: (user.jobs || []).map(transformSkill),
    location: transformLocation(user.location),
    membershipPackage: user.membership_package
      ? transformMembership(user.membership_package)
      : undefined,
    preferredFreelancer: user.preferred_freelancer || false,
    primaryCurrency: transformCurrency(user.primary_currency),
    primaryLanguage: user.primary_language,
    profileUrl: `/u/${user.username}`,
    qualifications: (user.qualifications || []).map(transformQualification),
    registrationDate: user.registration_date * 1000,
    reputation: transformReputation(user.reputation),
    responsiveness: transformResponsiveness(user.responsiveness),
    role: user.role,
    status: transformUserStatus(user.status),
    tagLine: user.tagline || '',
    username: user.username,
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
    corporate: transformCorporateDetailsApi(user.corporate),
    sanctions: transformUserSanctionApi(user.user_sanctions),
    timezone: transformTimezone(user.timezone),
  };
}

export function transformBadge(badge: BadgeApi): Badge {
  if (
    !badge.id ||
    !badge.name ||
    !badge.description ||
    !badge.time_awarded ||
    !badge.icon_url
  ) {
    throw new ReferenceError(`Missing a required timezone field.`);
  }

  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    timeAwarded: badge.time_awarded * 1000,
    iconUrl: badge.icon_url,
  };
}

export function transformQualification(
  qualification: QualificationApi,
): Qualification {
  if (!qualification.icon_url) {
    throw new ReferenceError(`Missing an icon_url field.`);
  }

  return {
    id: qualification.id,
    name: qualification.name,
    level: qualification.level,
    type: qualification.type,
    iconUrl: qualification.icon_url.replace('/img/insignia/', ''),
    description: qualification.description,
    iconName: qualification.icon_name,
    scorePercentage: qualification.score_percentage,
    userPercentile: qualification.user_percentile,
  };
}

export function transformTimezone(
  timezone?: TimezoneApi,
): Timezone | undefined {
  return timezone === undefined
    ? undefined
    : {
        id: timezone.id,
        country: timezone.country,
        timezone: timezone.timezone,
        offset:
          timezone.offset !== undefined
            ? transformTimezoneOffset(timezone.offset)
            : undefined,
      };
}

/**
 This function accepts floats like `9.0`, `3.5`, `-7.75`
 and converts them into Greenwich Mean Time (GMT).
 The conversion results in `+0900`, `+0330`, `-0745`
 */
function transformTimezoneOffset(offset: number): string {
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset);
  const minutes = 60 * (absOffset - hours);
  const sign = offset > 0 ? '+' : '-';
  const hoursPart = hours > 9 ? `${hours}` : `0${hours}`;
  const minutesPart = minutes > 9 ? `${minutes}` : `0${minutes}`;
  return `${sign}${hoursPart}${minutesPart}`;
}

export function transformMembership(
  membership: MembershipPackageApi,
): MembershipPackage {
  if (!membership.name) {
    throw Error(`Membership Package Object does not have name attribute.`);
  }
  if (!membership.id) {
    throw Error(`Membership Package Object does not have id attribute.`);
  }

  return {
    bidLimit: membership.bid_limit,
    bidRefreshRate: membership.bid_refresh_rate,
    id: membership.id,
    skillChangeLimit: membership.job_change_limit,
    skillLimit: membership.job_limit,
    name: membership.name,
    servicePostingLimit: membership.service_posting_limit,
    timeBidRefreshed: membership.time_bid_refreshed
      ? membership.time_bid_refreshed * 1000
      : undefined,
    badgeType: transformMembershipBadgeType(
      membership.name,
      membership.duration_type,
      membership.membership_level,
    ),
  };
}

function transformMembershipBadgeType(
  membershipName?: string,
  membershipDurationType?: TimeUnitApi,
  membershipLevel?: number,
): MembershipBadgeType | undefined {
  if (!membershipName || !membershipDurationType || !membershipLevel) {
    return undefined;
  }

  // We don't show the standard and the premier subscriptions
  if (membershipName === 'standard' || membershipName === 'premier') {
    return undefined;
  }

  switch (membershipDurationType) {
    case TimeUnitApi.MONTH: {
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
          throw new Error(
            `Unhandled monthly membership level ${membershipLevel}`,
          );
      }
    }

    case TimeUnitApi.YEAR: {
      switch (membershipLevel) {
        case 1:
          return MembershipBadgeType.ANNUAL_LEVEL_ONE;
        case 2:
          return MembershipBadgeType.ANNUAL_LEVEL_TWO;
        case 3:
          return MembershipBadgeType.ANNUAL_LEVEL_THREE;
        case 4:
          return MembershipBadgeType.ANNUAL_LEVEL_FOUR;
        case 5:
          return MembershipBadgeType.ANNUAL_LEVEL_FIVE;
        default:
          throw new Error(
            `Unhandled yearly membership level ${membershipLevel}`,
          );
      }
    }

    default:
      return undefined;
  }
}

function transformIsNewFreelancer(reputation: ReputationApi): boolean {
  return (
    !reputation.entire_history.reviews &&
    !reputation.earnings_score &&
    !reputation.entire_history.all
  );
}

export function transformResponsiveness(
  responsiveness: number | undefined,
): UserResponsiveness {
  switch (responsiveness) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return responsiveness;
    default:
      return undefined;
  }
}

export function transformCorporateDetailsApi(
  corporateDetails?: CorporateDetailsApi,
): CorporateDetails | undefined {
  if (!corporateDetails) {
    return undefined;
  }

  if (!corporateDetails.status || !corporateDetails.founder_id) {
    throw new Error(
      'Expecting corporate account status and founder id to be set.',
    );
  }

  return {
    status: corporateDetails.status,
    founderId: corporateDetails.founder_id,
  };
}

export function transformUserSanctionApi(
  userSanctions?: ReadonlyArray<UserSanctionApi>,
): ReadonlyArray<UserSanction> {
  if (userSanctions === undefined) {
    return [];
  }

  return userSanctions.map(sanction => ({
    startDate: sanction.start_date * 1000,
    endDate: sanction.end_date * 1000,
    penalty: sanction.penalty,
  }));
}
