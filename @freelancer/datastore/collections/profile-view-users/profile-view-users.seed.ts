import { CurrencyCode } from '../currencies/currencies.seed';
import { Location } from '../project-view-users/location.model';
import { LocationPreset } from '../project-view-users/location.seed';
import {
  generateSkills,
  projectViewUserLocations,
} from '../project-view-users/project-view-users.seed';
import { UserStatus } from '../project-view-users/user-status.model';
import { generateFreelancerReputationObjects } from '../reputation/reputation-data.seed';
import { Reputation } from '../reputation/reputation.model';
import { Skill } from '../skills/skills.model';
import { User } from '../users/users.model';
import { generateUserObject, unverifiedUser } from '../users/users.seed';
import { ProfileViewUser } from './profile-view-users.model';

export interface GenerateProfileViewUsersOptions {
  readonly users: ReadonlyArray<User>;
  readonly currencyCode?: CurrencyCode;
  readonly location?: Location;
}

export function generateProfileViewUserObjects({
  users,
  currencyCode = CurrencyCode.USD,
  location,
}: GenerateProfileViewUsersOptions): ReadonlyArray<ProfileViewUser> {
  const reputationObjects = generateFreelancerReputationObjects({
    userIds: users.map(user => user.id),
  });

  return users.map((user, index) => ({
    ...generateProfileViewUserObject({
      user,
      currencyCode,
      reputation: reputationObjects[index],
      location,
    }),
  }));
}

export interface GenerateProfileViewUserOptions {
  readonly user: User;
  readonly currencyCode?: CurrencyCode;
  readonly skills?: ReadonlyArray<Skill>;
  readonly location?: Location;
  readonly preferredFreelancer?: boolean;
  readonly registrationDate?: number;
  readonly reputation?: Reputation;
  readonly status?: UserStatus;
  readonly tagLine?: string;
  readonly hourlyRate?: number;
}

export function generateProfileViewUserObject({
  user,
  currencyCode = CurrencyCode.USD,
  skills = generateSkills(),
  location = projectViewUserLocations[LocationPreset.SEATTLE],
  preferredFreelancer = false,
  registrationDate = Date.now(),
  tagLine = 'This is my tagline.',
  hourlyRate,
}: GenerateProfileViewUserOptions): ProfileViewUser {
  const {
    id,
    username,
    displayName,
    role,
    chosenRole,
    status,
    enterpriseIds,
  } = user;
  return {
    ...generateUserObject({
      userId: id,
      username,
      displayName,
      enterpriseIds,
      role,
      chosenRole,
      currencyCode,
      userStatus: status,
    }),

    // Shared fields with ProjectViewUser
    skills,
    preferredFreelancer,
    registrationDate,
    qualifications: [],
    tagLine,
    location,
    hourlyRate,
    status: status || unverifiedUser().userStatus,

    // Fields specific to ProfileViewUser
    coverImage: undefined,
    corporate: undefined,
    timezone: {
      // TODO: Make dependent on location/country
      id: 422,
      country: 'AU',
      timezone: 'Australia/Sydney',
      offset: 'GMT+11:00',
    },
    portfolioCount: 0,
    profileDescription: 'This is my profile description.',
    publicName: displayName, // FIXME: computed field, see transformer,
    isProfileVisible: true,
  };
}
