import {
  CorporateDetailsApi,
  CoverImageResultApi,
  UserApi,
} from 'api-typings/users/users';
import { transformCurrency } from '../currencies/currencies.transformers';
import {
  Enterprise,
  Pool,
  POOL_ID_TO_POOL_API_MAP,
} from '../enterprise/enterprise.model';
import {
  transformQualification,
  transformResponsiveness,
  transformTimezone,
} from '../project-view-users/project-view-users.transformers';
import { transformSkill } from '../skills/skills.transformers';
import { transformLocation } from '../users/users-location.transformers';
import {
  transformUserImage,
  transformUserStatus,
} from '../users/users.transformers';
import {
  CorporateDetails,
  CoverImageResult,
  ProfileViewUser,
} from './profile-view-users.model';

export function transformProfileViewUsers(user: UserApi): ProfileViewUser {
  if (!user.id || !user.status || user.closed === undefined) {
    throw new ReferenceError('Missing a required user field.');
  }

  const publicName: string =
    user.support_status && user.support_status.short_name
      ? user.support_status.short_name
      : user.public_name || user.display_name || user.username;

  return {
    avatarLarge: user.avatar_large_cdn
      ? transformUserImage(user.avatar_large_cdn)
      : undefined,
    coverImage: user.cover_image
      ? transformCoverImageResult(user.cover_image)
      : undefined,
    corporate: transformCorporateDetailsApi(user.corporate),
    closed: user.closed,
    hourlyRate: user.hourly_rate,
    id: user.id,
    skills: (user.jobs || []).map(transformSkill),
    location: user.location ? transformLocation(user.location) : undefined,
    portfolioCount: user.portfolio_count || 0,
    preferredFreelancer: user.preferred_freelancer,
    primaryCurrency: user.primary_currency
      ? transformCurrency(user.primary_currency)
      : undefined,
    profileDescription: user.profile_description,
    profileUrl: `/u/${user.username}`,
    publicName,
    qualifications: (user.qualifications || []).map(transformQualification),
    recommendations: user.recommendations,
    registrationDate: user.registration_date
      ? user.registration_date * 1000
      : undefined,
    responsiveness: transformResponsiveness(user.responsiveness),
    role: user.role,
    status: transformUserStatus(user.status),
    tagLine: user.tagline,
    timezone: transformTimezone(user.timezone),
    username: user.username,
    enterpriseIds: user.enterprise_ids,
    // Handle the case where pool IDs are an integer, but also the case where
    // they are strings, to maintain forwards and backwards compatibility.
    // TODO: Cleanup T221545
    poolIds: (user.pool_ids || []).map(id =>
      typeof id === 'string' ? id : POOL_ID_TO_POOL_API_MAP[id as Pool],
    ),
    isDeloitteDcUser: user.enterprise_ids?.includes(Enterprise.DELOITTE_DC),
    isProfileVisible: user.is_profile_visible,
  };
}

export function transformCoverImageResult(
  coverImage: CoverImageResultApi,
): CoverImageResult {
  return {
    currentImage: coverImage.current_image,
  };
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
